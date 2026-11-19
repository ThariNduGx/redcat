import base64
import binascii
import hashlib
import json
import os
import re
from datetime import datetime, timezone

import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")
storage = boto3.client("s3")
ROLES = {"bdm", "zom", "general"}
MAX_CV_BYTES = 2 * 1024 * 1024
UUID = re.compile(r"[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}")


def response(status, **body):
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json", "Cache-Control": "no-store"},
        "body": json.dumps(body),
    }


def parse(event):
    raw = event.get("body") or ""
    if len(raw) > 4_000_000:
        raise ValueError("Choose a PDF CV no larger than 2 MB.")
    if event.get("isBase64Encoded"):
        raw = base64.b64decode(raw, validate=True)
    data = json.loads(raw)
    if not isinstance(data, dict):
        raise ValueError("Enter your application details.")
    if data.get("website"):
        raise ValueError("We couldn’t accept this submission.")

    fields = {}
    for key, limit in {"id": 36, "role": 7, "name": 120, "email": 254, "phone": 32, "message": 2000}.items():
        value = data.get(key, "")
        if not isinstance(value, str) or len(value) > limit:
            raise ValueError("Check your application details and try again.")
        fields[key] = value.strip()
    if not UUID.fullmatch(fields["id"]) or fields["role"] not in ROLES or not fields["name"]:
        raise ValueError("Enter your name and select a valid position.")
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", fields["email"]):
        raise ValueError("Enter a valid email address.")
    phone = fields["phone"]
    if not re.fullmatch(r"[+\d][\d() .-]+", phone) or not 7 <= sum(c.isdecimal() for c in phone) <= 15:
        raise ValueError("Enter a valid phone number.")

    encoded = data.get("cv")
    if not isinstance(encoded, str) or len(encoded) > 4 * ((MAX_CV_BYTES + 2) // 3):
        raise ValueError("Choose a PDF CV no larger than 2 MB.")
    try:
        pdf = base64.b64decode(encoded, validate=True)
    except (ValueError, binascii.Error):
        raise ValueError("Choose a valid PDF CV.") from None
    if len(pdf) > MAX_CV_BYTES or not pdf.startswith(b"%PDF-"):
        raise ValueError("Choose a PDF CV no larger than 2 MB.")
    return fields, pdf


def submit(event, _context):
    content_type = (event.get("headers") or {}).get("content-type", "")
    if content_type.split(";", 1)[0].strip().lower() != "application/json":
        return response(415, error="Send the application as JSON.")
    try:
        fields, pdf = parse(event)
    except (json.JSONDecodeError, UnicodeError, binascii.Error):
        return response(400, error="Enter your application details and choose a PDF CV.")
    except ValueError as exc:
        return response(400, error=str(exc))

    application_id = fields["id"]
    fingerprint = hashlib.sha256(json.dumps(fields, sort_keys=True).encode() + pdf).hexdigest()
    key = f"applications/{application_id}/{fingerprint}.pdf"
    table = dynamodb.Table(os.environ["APPLICATIONS_TABLE"])
    try:
        existing = table.get_item(Key={"id": application_id}, ConsistentRead=True).get("Item")
        if existing is None:
            try:
                table.put_item(
                    Item={
                        **fields, "fingerprint": fingerprint, "cv_key": key,
                        "received_at": datetime.now(timezone.utc).isoformat(),
                        "status": "pending",
                    },
                    ConditionExpression="attribute_not_exists(id)",
                )
                existing = {"fingerprint": fingerprint, "status": "pending"}
            except ClientError as exc:
                if exc.response["Error"]["Code"] != "ConditionalCheckFailedException":
                    raise
                existing = table.get_item(Key={"id": application_id}, ConsistentRead=True)["Item"]

        if existing["fingerprint"] != fingerprint:
            return response(409, error="The application details changed. Please reselect your CV and try again.")
        if existing["status"] == "received":
            return response(200, id=application_id)

        storage.put_object(
            Bucket=os.environ["CV_BUCKET"], Key=key, Body=pdf,
            ContentType="application/pdf", ContentDisposition="attachment",
        )
        table.update_item(
            Key={"id": application_id},
            UpdateExpression="SET #status = :received",
            ConditionExpression="fingerprint = :fingerprint",
            ExpressionAttributeNames={"#status": "status"},
            ExpressionAttributeValues={":received": "received", ":fingerprint": fingerprint},
        )
        return response(201, id=application_id)
    except ClientError as exc:
        # Avoid logging applicant information or request bodies.
        print(f"Career application storage failed: {exc.response['Error']['Code']}")
        return response(503, error="We couldn’t confirm your submission. Please try again.")
