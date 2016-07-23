FROM      node

ENV       PORT  80

RUN       npm install -g http-server

WORKDIR   /var/www

ADD       _site/ .

EXPOSE    $PORT

CMD       http-server -p $PORT .
