# REDCAT marketing site — roadmap

Repo: `Redcat-Landing-Page` (Next.js 16, static export). Infra: this repo, `modules/static-site`.
Hostnames: `redcat.lk` and `www.redcat.lk` (`www` redirects to apex).
Account: `redcat-dev` for now (decision 2026-10-09); moves to prod/shared later (see "Later").

## Architecture

```
browser → Route 53 (redcat.lk, management account) ALIAS
        → CloudFront (us-east-1 cert, HTTPS only, CloudFront Function: URL rewrite + www redirect)
            default behavior  → S3 bucket (private, OAC)        static HTML/JS/CSS
            /api/*            → Lambda function URL (ARM64)     enquiry form → SES e-mail
```

Why static: every page renders without cookies/headers/searchParams; the only server code is
`app/api/enquiry`, which today just logs. It becomes a Lambda. Cost < $2/month, no scheduler.

## Phase L1 — S3 side of the module
- [ ] `modules/static-site/` skeleton: `main.tf`, `variables.tf`, `outputs.tf`, `versions.tf`, `README.md`
- [ ] `aws_s3_bucket` `redcat-dev-landing-<account-id>`; public access block (all four `true`);
      versioning enabled; SSE-S3
- [ ] `aws_cloudfront_origin_access_control` (s3, always, sigv4)
- [ ] Bucket policy: `cloudfront.amazonaws.com`, `s3:GetObject` on `bucket/*` only,
      condition `AWS:SourceArn` = this distribution (no `ListBucket`)

## Phase L2 — CloudFront
- [ ] CloudFront Function (`viewer-request`): `/about` → `/about.html`, `/x/` → `/x/index.html`,
      `www.redcat.lk` → 301 `https://redcat.lk`
- [ ] `aws_cloudfront_distribution`: S3 origin with OAC, `redirect-to-https`, HTTP/2 + HTTP/3,
      `PriceClass_200`, compression on, managed cache policy `CachingOptimized`,
      custom error 404 → `/404.html`, (403 from S3 → 404 page too)
- [ ] Outputs: `bucket_name`, `bucket_arn`, `distribution_id`, `distribution_arn`,
      `distribution_domain_name`, `hosted_zone_id`
- [ ] `envs/dev/main.tf`: `module "landing"`; `terraform fmt`, `validate`, `plan` clean;
      apply through the pipeline; test with the `*.cloudfront.net` name

## Phase L3 — Domain
- [ ] `module "cert_landing"` (`acm-certificate`, provider `aws.us_east_1`): `redcat.lk` +
      SAN `www.redcat.lk`; validation CNAMEs added by hand in the management zone
- [ ] `aliases` + `certificate_arn` on the distribution (`certificates_validated` toggle like Phase 7)
- [ ] ALIAS A + AAAA for `redcat.lk` and `www.redcat.lk` in the management zone → distribution
- [ ] Test: `curl -I https://redcat.lk/about`, `https://www.redcat.lk` → 301, HTTP → HTTPS

## Phase L4 — Pipeline (landing repo)
- [ ] `ci_oidc`: new repo entry `redcat-landing-page` with a deploy role; policy limited to
      `s3:PutObject/DeleteObject/ListBucket` on the landing bucket and
      `cloudfront:CreateInvalidation` on the one distribution
- [ ] `bitbucket-pipelines.yml`: PR → lint + `next build`; merge to `main` →
      `aws s3 sync out/ s3://<bucket> --delete` with cache headers
      (`/_next/static/*` `max-age=31536000, immutable`; HTML `max-age=0, must-revalidate`),
      then `create-invalidation --paths "/*"`
- [ ] Repository variables `AWS_ACCOUNT_ID`, `DEPLOY_ROLE_ARN`, `S3_BUCKET`, `CLOUDFRONT_ID`
- [ ] `main` protected: PR only, passing build; `netlify.toml` removed

## Phase L5 — Enquiry form
- [ ] Decide destination: SES e-mail to `admin@redcat.lk` (needs company e-mail first) or SNS
- [ ] `modules/lambda-function` (or inline in `static-site`): ARM64, Node 22, function URL
      `AWS_IAM` auth off but CloudFront-only via a secret header check, 10 s timeout,
      env `TO_EMAIL`; IAM: `ses:SendEmail` on the identity only
- [ ] SES domain identity for `redcat.lk` (DKIM CNAMEs in the management zone); sandbox exit request
- [ ] Cache behavior `/api/*` → Lambda origin, `CachingDisabled`, `AllViewerExceptHostHeader`
- [ ] Landing repo: delete `app/api/enquiry`, form posts to `NEXT_PUBLIC_ENQUIRY_URL`
      (`/api/enquiry` on the same domain); keep honeypot; Lambda validates the same fields
- [ ] Lambda error alarm → `redcat-dev-alerts`

## Phase L6 — Operations
- [ ] CloudFront alarms: 5xx error rate, (optional) total requests spike → `redcat-dev-alerts`
- [ ] CloudFront standard logs to a log bucket (30-day lifecycle) — optional, cost
- [ ] Security headers via managed response headers policy (`SecurityHeadersPolicy`) or custom:
      HSTS, X-Content-Type-Options, Referrer-Policy, CSP (frontend to confirm map tile domains)
- [ ] README in `modules/static-site`; ARCHITECTURE.md gets a "marketing site" section

## Frontend team (tracked here, not infra)
- [ ] `next.config.ts`: `output: "export"`, `images: { unoptimized: true }`,
      confirm the build passes with `cacheComponents: true` (remove if not)
- [ ] `trailingSlash` decision (affects the CloudFront Function rewrite rule)
- [ ] Delete `app/api/enquiry`; form URL from env
- [ ] Fill `CONTACT` in `lib/site.ts`; favicon; OG image

## Later
- [ ] Move to the prod (or shared) account: same module, new bucket + distribution, re-sync,
      re-point the two ALIAS records
- [ ] WAF on the distribution (rate limit on `/api/*`) when the form goes live
- [ ] Preview deployments per PR (second bucket prefix + `preview.redcat.lk`) — nice to have
