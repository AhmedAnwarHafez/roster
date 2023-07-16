- Replace `username` and `repository` with actual names

```bash
npm -g install git+https://github.com/username/repository.git
```

- Create an .env file in `~/.roster/` and paste the REDIS_URL

## Usage

- To list all teachers on the floor:

```
roster show
```

- To update

```
roster update --name ahmad --availability true --password 123
```

_PRO TIP_: create an alias for `on` and `off` for convience
