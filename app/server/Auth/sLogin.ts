/// <reference path="../index.d.ts" />

import Auth from './sAuth';
import Browser from '../Options/sBrowser';
import Camera from '../Options/sCamera';
import Logger from '../Options/sLogger';
import DB from '../Options/sDB';
import PlayerSingletone from '../Player/sPlayerSingletone';

class Login extends Auth {
    loginScreenPlayerPos: Vector3Mp;
    camPos1: Vector3Mp;
    camPos2: Vector3Mp;
    camViewangle: number;

    constructor() {
        super();
        this.loginScreenPlayerPos = new mp.Vector3(3294, 5216, 17);
        this.camPos1 = new mp.Vector3(3331.6, 5222.5, 23);
        this.camPos2 = new mp.Vector3(0, 0, 212);
        this.camViewangle = 55;

        mp.events.add({		
			"playerReady" : (player: PlayerMp) => {
                this.playerReady(player);
            },

            "sLogin-Login" : (player: PlayerMp, data: string) => {
                this.login(player, data);
            },
		});
    }

    playerReady(player: PlayerMp) {
        Camera.createCamera(player, this.camPos1, this.camPos2, this.camViewangle);
        player.spawn(this.loginScreenPlayerPos);
        player.dimension = 0;
        Browser.setUrl(player, '/login', true);
        Logger.debug(`${player.name} connected`);
    }

    async login(player: PlayerMp, data: string) {
        const obj = JSON.parse(data);
        const result: any = await DB.query(`SELECT guid, email, password, salt, socialclub FROM users WHERE email = ${DB.escape(obj.email)} LIMIT 1`);
        if (!result[0]) {
            Browser.showNotification(player, `This email doesn't exists!`, `red`, 4, `Wrong email address`, `error.svg`);
            Logger.warn(`${player.name} | ${player.socialClub} | ${player.ip} entered wrong email! Email: ${obj.email}`);
        } else {
            let guid: number = result[0].guid;
            let email: string = obj.email;
            let password1: string = result[0].password;
            let password2: string = this.hashPassword(obj.password, result[0].salt);

            if (password1 !== password2) {
                Browser.showNotification(player, `Wrong password`, `red`, 4, `Error`, `error.svg`);
                Logger.warn(`${player.name} | ${player.socialClub} | ${player.ip} entered wrong password! Email: ${email}`);
            } else if (this.isAlreadyPlaying(email)) {
                Browser.showNotification(player, `This user already playing now!`, `red`, 4, `Error`, `error.svg`);
                Logger.warn(`${player.name} | ${player.socialClub} | ${player.ip} tried to log in from another PC! Email: ${email}`);
            } else {
                this.loadAccount(player, guid);
            }
        }
    }

    isAlreadyPlaying(email: string) {
        for (const player of mp.players.toArray()) {
            if (player.loggedIn && player.email === email) {
                return true;
            }
        }

        return false;
    }

    loadAccount(player: PlayerMp, guid: number) {
        Browser.setLoadingScreenState(player, true);
        Browser.setUrl(player, '/', false);
        Camera.resetCamera(player);
        PlayerSingletone.loadAccount(player, guid);
    }

}
new Login();