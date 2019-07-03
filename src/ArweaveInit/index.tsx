import Arweave from 'arweave/web';


export default function arweave(): Arweave {
    let arweave = Arweave.init({
        host: 'arweave.net',
        port: 443,
        protocol: 'https'
    });
    return arweave
}
