class Sound {
    constructor() {
        //オーディオのインスタンス
        this.ctx = new AudioContext();
        //デコード(プログラム化)されたオーディオデータ
        this.source = null;
    }
    load(audioPath, callback) {
        //fetchメソッドにより外部のデータの取得が可能
        fetch(audioPath)
        .then((response) => {
            return response.arrayBuffer();
        })
        .then((buffer) => {
            return this.ctx.decodeAudioData(buffer);
        })
        .then((decodeAudio) => {
            this.source = decodeAudio;
            callback();
        })
        .catch(() => {
            callback('error!');
        });
    }

    play() {
        let node = new AudioBufferSourceNode(this.ctx, {buffer: this.source});
        node.connect(this.ctx.destination);
        node.addEventListener('ended', () => {
            node.stop();
            node.disconnect();
            node = null;
        },false);
        node.start();
    }
}