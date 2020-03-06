import { parseAssetBundle } from 'unitiyfs-asset-parser';

function parseFromBundle(data: any): any {
    // Josh addition. Something has gone wrong with the unity format or something. 
    // So, if this assetbundle (whatever that means) doesn't parse, just skip it.
    let assetBundle = null;
    try {
        assetBundle = parseAssetBundle(new Uint8Array(data.buffer));
    }
    catch {
        return null;
    }
    if (!assetBundle || !assetBundle.imageBitmap) {
        console.error('Fail to parse an image out of this bundle!');
        return [];
    }
    else {
        if (data.assetName && data.assetName.length > 0) {
            let sprite = assetBundle.sprites.find((sprite: any) => sprite.spriteName === data.spriteName);
            if (!sprite) {
                console.error('Sprite not found!');
                return [];
            }
            return sprite.spriteBitmap;
        }
        else {
            return assetBundle.imageBitmap;
        }
    }
}

self.addEventListener('message', (message: any) => {
    let result = parseFromBundle(message.data);

    // If assetbundle didn't parse above, then skip the stuff below
    if (!result) {
        (self as any).postMessage(null);
        self.close();
    }

    if (result.data.length > 0) {
        (self as any).postMessage(result, [result.data.buffer]);
    }
    else {
        (self as any).postMessage(result);
    }

    // close this worker
    self.close();
});