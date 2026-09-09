FROM dunglas/frankenphp:latest

# Install system dependencies & PHP extensions for Laravel, PostgreSQL, and media processing
RUN install-php-extensions \
    pdo_pgsql \
    pgsql \
    pdo_mysql \
    redis \
    gd \
    intl \
    zip \
    bcmath \
    opcache \
    pcntl \
    exif

# Copy Composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Environment variables
ENV SERVER_NAME=":80"
ENV CADDY_SERVER_ADMIN="off"

# Expose ports
EXPOSE 80 443 2019

# Healthcheck targeting Laravel /up health endpoint
HEALTHCHECK --interval=10s --timeout=5s --retries=3 CMD curl -f http://localhost:80/up || exit 1

CMD ["frankenphp", "php-server", "--root", "/app/public"]
