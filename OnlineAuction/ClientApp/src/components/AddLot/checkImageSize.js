export default function checkImageSize(file, callback){
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        let image = new Image();
        image.src = e.target.result;
        image.onload = function () {
            callback(this.height <= this.width);
        };
    }
}