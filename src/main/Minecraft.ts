import jdk_utils from "jdk-utils";
import path = require("path");

const MCLCore = require("../../resources/minecraft-run/launcher.js");
const Authenticator = require("../../resources/minecraft-run/authenticator.js");

export class Minecraft {
    pack_id: String;
    version: String;
    nickname: String;
    loadData: Object;
    loadStatus: Object;
    moreOptions: Object;
    constructor(nickname, pack_id, version, more_options) {
        this.pack_id = pack_id;
        this.version = version;
        this.moreOptions = more_options;
        this.loadData = {
            path: "[НИЧЕГО]"
        }
        this.nickname = nickname;
    }

    launch() {
        jdk_utils.findRuntimes().then((data) => {
            if (data.filter(runtime => runtime.homedir.includes("17")).length > 0) {
                const roaming = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
                const launcher = new MCLCore();

                let opts = {
                    // For production launchers, I recommend not passing
                    // the getAuth function through the authorization field and instead
                    // handling authentication outside before you initialize
                    // MCLC, so you can handle auth based errors and validation!
                    authorization: Authenticator.getAuth(this.nickname),
                    root: roaming == process.env.APPDATA ? roaming + "\\.ftlauncher\\"+this.pack_id : roaming + "/ftlauncher/"+this.pack_id,
                    javaPath: path.join(data.filter(runtime => runtime.homedir.includes("17"))[0].homedir, "bin", "java.exe"),
                    version: {
                        number: this.version,
                        type: "release"
                    },
                    memory: {
                        max: "6G",
                        min: "4G"
                    },
                    ...this.moreOptions
                }

                launcher.launch(opts);

                launcher.on('debug', (e) => console.log(e));
                launcher.on('data', (e) => console.log(e));
                // launcher.on('download', (e) => console.log(e));
                launcher.on('download-status', (e) => {
                    this.loadData = e;
                });
                launcher.on('status', (e) => {
                    this.loadStatus = e;
                });
            }
        })
    }

    get loadData(): String {
        return this.loadData;
    }

    get loadStatus(): Object {
        return this.loadStatus;
    }
}