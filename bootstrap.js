
const fs = require('fs')
const fetch = require('node-fetch')

let application = fs.readFileSync('./application.yml', 'utf8')

if (process.env.PORT) {
    application = application.replace('DYNAMICPORT', process.env.PORT)
}

if (process.env.PASS) {
    application = application.replace('youshallnotpass', process.env.PASS)
}
fs.writeFileSync('./application.yml', application)

const download = function (url, dest, cb) { //modified code from https://stackoverflow.com/a/22907134
    const file = fs.createWriteStream(dest);
    fetch(url).then(res=>{
        res.body.pipe(file)
        console.log('Downloading Lavalink.jar')
        file.on('finish', function () {
            console.log('Downloaded Lavalink.jar')
            file.close(cb);
            
        });
    }).on('error', function (err) {
        fs.unlinkSync(dest);
        console.error(err)
    });
        });
    })
};

function startLavalink() {
    const spawn = require('child_process').spawn;
    const child = spawn('java', ['-jar', 'Lavalink.jar'])

    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')

    child.stdout.on('data', (data) => {
        console.log(data);
    });

    child.stderr.on('data', (data) => {
        console.error(data);
    });

    child.on('error', (error) => {
        console.error(error);
    });

    child.on('close', (code) => {
        console.log(`Lavalink exited with code ${code}`);
    });
    if (process.env.APP_NAME)
        keepAlive();
}


console.log('Fetching latest Lavalink.jar url...')
fetch('https://api.github.com/repos/Frederikam/Lavalink/releases/latest')
    .then(res => res.json())
    .then(json => {
        console.log('Found: '+json.assets[0].browser_download_url)
        download(json.assets[0].browser_download_url, './Lavalink.jar', startLavalink)
    });

function keepAlive() {
    console.log('Keeping alive.');

    const fetch = require('node-fetch');

    let count = 0;
    setInterval(() =>
        fetch(`http://${process.env.APP_NAME}.herokuapp.com/`, { headers: { Authorization: process.env.PASS } })
            .then(() => console.log(`[${++count}] Kept server alive.`))
            .catch(() => console.log(`Failed to keep server alive.`))
        , 5 * 60 * 1000);
}

