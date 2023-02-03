export function fileReaderImgAdvertisements(fileReader,imgUrl,setImgUrl){
  fileReader.onloadend = () => {
    let item;
    imgUrl?item = [...imgUrl,fileReader.result]:item = [fileReader.result]
    setImgUrl(item);
  }
}

export function fileReaderImgOwner(fileReader2,setImgUrl2){
  fileReader2.onloadend = () => {
    setImgUrl2(fileReader2.result)
  }
}

export function fileReaderImgUser(fileReader2,setImgUrl2){
  fileReader2.onloadend = () => {
    setImgUrl2(fileReader2.result)
  }
}