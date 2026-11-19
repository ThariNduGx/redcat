# Careers applications

The static site sends the form to an API Gateway HTTP API. Lambda writes applicant
details to DynamoDB and saves the CV in a private S3 bucket. The browser displays a
reference number after both writes succeed. Email setup is not required.

From this directory, using the RedCat AWS account and an AWS SAM CLI session:

```sh
sam validate --template-file template.yaml
sam deploy --template-file template.yaml --guided --region ap-south-1
```

Set `SiteOrigin` to the exact deployed site origin, for example
`https://redcat.lk`. Copy the `CareersApiUrl` stack output into the site's build
environment as `NEXT_PUBLIC_CAREERS_API_URL`, then rebuild and deploy the static
site. For Bitbucket, configure it as a repository variable available to the build
step. For Netlify, set it for the build scope. The public API URL contains no
credentials. Until it is set, the form displays an unavailable message.

HR can review rows with status `received` in the DynamoDB console using
company-managed AWS access. Give reviewers read access only to the applications
table and the CV bucket's `applications/` prefix. Match the row's `cv_key` to
the object in S3 and open downloaded PDFs in the approved file viewer. A
`pending` row means the upload did not complete. A retry of the same submission
can complete it without adding a second row. Set a recruitment retention period
and remove stale or expired application rows and their CVs together.

Before enabling the form for real applicants, send a synthetic application with
a harmless PDF. Check that the receipt matches a `received` row and that the CV
is retrievable using reviewer access. Verify that unauthenticated reads of the
CV fail. Historical submissions must be recovered separately from whatever
system originally accepted them, if any.
