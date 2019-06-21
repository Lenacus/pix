## Pré-requis :

Faire tourner l'API en désactivant reCAPTCHA et MailJet. [PR #478](https://github.com/1024pix/pix/pull/478)

## Procédure :

```
npm ci
npm run start
npm run report
```

## Debugging HTTP Tests

Source : https://artillery.io/docs/examples/#debugging-http-tests

If you’d like to see the details of every HTTP request that Artillery is sending, run it like:

```
DEBUG=http artillery run myscript.yaml
```

If you’d like to see every response that Artillery receives from the server, run with:
```
DEBUG=http:response artillery run myscript.yaml
```
