# RedCat careers intake on cPanel

The RedCat site stays on its existing static host. The applicant's browser sends
the application to a PHP endpoint over HTTPS. PHP saves the details and PDF
together in one private MySQL or MariaDB row. The endpoint only accepts
submissions. It provides no public way to list applications or download CVs.

## Set up on cPanel

1. Choose a dedicated HTTPS hostname for the handler, such as
   `apply.redcat.lk`, if your hosting account and DNS support it. Give the
   hostname its own document root and confirm its SSL certificate. Keep the
   existing RedCat website's DNS and hosting in place.
2. Use **Database Wizard** to create a dedicated database and a database user for
   the handler. Grant **SELECT** and **INSERT** on this database only. Use
   **phpMyAdmin** with your account's administrative access to select that
   database and import `schema.sql`.
3. Upload `apply.php`, `.htaccess`, and `index.html` to the hostname's document root
   (`/home/bestprod/apply.bestproducts.lk/`). The `.htaccess` and `index.html` files
   disable directory browsing and redirect root visitors to `https://redcat.lk/hr`.
   Create `redcat-careers-config.php` one directory above that root using
   `config.example.php`. This location must be outside every website document
   root. Use the full cPanel database and user names, add the password directly
   on the server, and list the exact production website origins that will submit
   applications. If you use both the apex domain and `www`, add both explicitly.
   Limit config file permissions to the PHP execution account.
4. Enable PHP 8.2 or newer with PDO MySQL, mbstring and fileinfo. Allow requests
   of at least 7 MiB through the web server and PHP, including PHP's
   `post_max_size`. Ensure MySQL permits packets of at least 8 MiB. Configure request rate limiting on the upload
   endpoint through the host or reverse proxy before enabling public intake.

## Connect the website

The careers page uses the verified cPanel endpoint at
`https://apply.bestproducts.lk/apply.php` by default. To use a different endpoint,
set `NEXT_PUBLIC_CAREERS_CPANEL_URL` at build time and redeploy. The registration
form saves Area and Experience together as labeled text in the existing
`message` column, so the database needs no migration. Deploy the updated
`apply.php` before shipping the form with the 5 MB CV limit.

Submit a synthetic application with a harmless PDF and confirm that its receipt
matches a row in `career_applications`. Retry the same request to confirm it
doesn't create a duplicate. Confirm that a GET request to `apply.php` cannot
retrieve applicant data. Limit cPanel/phpMyAdmin database access to authorised
reviewers or administrators. The PDF is stored in the `cv` column. A dedicated HR
review dashboard is a separate feature. Review existing Tally submissions
separately. They are not copied by deploying this handler.
