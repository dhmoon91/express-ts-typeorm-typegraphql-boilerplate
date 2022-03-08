Install postgresql
Run following to create new db:

```
CREATE USER termin_admin WITH SUPERUSER PASSWORD 'termin';

CREATE DATABASE termin_dev OWNER termin_admin;
```

Run `npm i`

`npm run dev` -> Server will start on port 5000

## Redis setup

...
