#!/usr/bin/env bash

while [ true ]
do
    php /var/www/html/artisan schedule:run --verbose --no-interaction &
    php /Users/isabakir/Downloads/task/flalingo/laravel-react-admin/artisan schedule:run --verbose --no-interaction &
    sleep 60
done
