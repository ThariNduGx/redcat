## Phase L1 — S3 side of the module ✅
- [x] `modules/static-site/` skeleton: `main.tf`, `variables.tf`, `outputs.tf`, `versions.tf`, `README.md`
- [x] `aws_s3_bucket` `redcat-dev-landing-<account-id>`; public access block (all four `true`);
      versioning enabled; SSE-S3
- [x] `aws_cloudfront_origin_access_control` (s3, always, sigv4)
- [x] Bucket policy: `cloudfront.amazonaws.com`, `s3:GetObject` on `bucket/*` only,
      condition `AWS:SourceArn` = this distribution (no `ListBucket`)

## Phase L2 — CloudFront ✅
- [x] CloudFront Function (`viewer-request`): `/about` → `/about.html`, `/x/` → `/x/index.html`,
      `www.<domain>` → 301 `https://<domain>` (path and query string kept)
- [x] `aws_cloudfront_distribution`: S3 origin with OAC, `redirect-to-https`, HTTP/2 + HTTP/3,
      `PriceClass_All` (Australian edges), compression on, managed cache policy `CachingOptimized`,
      custom error 404 → `/404.html`, (403 from S3 → 404 page too)
- [x] Outputs: `bucket_name`, `bucket_arn`, `distribution_id`, `distribution_arn`,
      `distribution_domain_name`, `hosted_zone_id`
- [x] `envs/dev/main.tf`: `module "landing"`; applied through the pipeline; tested with the
      `*.cloudfront.net` name (200, rewrite 200, missing 404, HTTP 301, direct S3 403)

## Phase L3 — Domain ✅
- [x] `module "cert_landing"` (`acm-certificate`, provider `aws.us_east_1`): `redcat.lk` +
      SAN `www.redcat.lk`; validation CNAMEs added by hand in the management zone (keep them: renewals)
- [x] `aliases` + `certificate_arn` on the distribution; own toggle `landing_certificate_validated`
      (the shared `certificates_validated` was already `true`)
- [x] ALIAS A + AAAA for `redcat.lk` and `www.redcat.lk` in the management zone → distribution
- [x] Test: `https://redcat.lk/about` 200, `https://www.redcat.lk` → 301 `https://redcat.lk/`
- ⚠️ The bucket holds three test pages until L4 deploys the real build. Don't share the URL yet.

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
