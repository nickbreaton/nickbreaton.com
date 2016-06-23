FROM      node

ENV       PORT  80

RUN       npm install -g http-server

WORKDIR   /var/www

ADD       public/ .

EXPOSE    $PORT

CMD       http-server -p $PORT .
