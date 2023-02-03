import { fileReaderImgAdvertisements, fileReaderImgOwner, fileReaderImgUser } from "./fileReader";

export const downLoadImgAdvertisements = (event,fileReader,imgUrl,setImgUrl,urlInfo) => {
  const file = event.files[0];
  fileReader.readAsDataURL(file);
  urlInfo?fileReaderImgAdvertisements(fileReader,urlInfo,setImgUrl):
  fileReaderImgAdvertisements(fileReader,imgUrl,setImgUrl);
}

export const downLoadImgOwner = (event,fileReader2,setImgUrl2) => {
  const file = event.files[0];
  fileReader2.readAsDataURL(file);
  fileReaderImgOwner(fileReader2,setImgUrl2);
}

export const downLoadImgUser = (event,fileReader3,setimgUrlUser) => {
  const file = event.files[0];
  fileReader3.readAsDataURL(file);
  fileReaderImgUser(fileReader3,setimgUrlUser);
}

export const handlePriceMin = (event,setpriceMin) => {
  const result = event.value.replace(/\D/g,"");
  setpriceMin(result);
}

export const handlePriceMax = (event,setpriceMax) => {
  const result = event.value.replace(/\D/g,"");
  setpriceMax(result);
}

export const handleCityInfo = (event,setCityInfo) => {
  const result = event.value;
    setCityInfo(result);
}

export const handleSentInfo = (event,setSentInfo) => {
  const result = event.value.replace(/\D/g, '');
  setSentInfo(result);
}

export const handleRoomsInfo = (event,setroomsInfo) => {
  const result = event.value;
  setroomsInfo(result);
}

export const handleTotalInfo = (event,settotalInfo) => {
  const result = event.value;
  settotalInfo(result);
}

export const handleSquareInfo = (event,setsquareInfo) => {
  const result = event.value.replace(/\D/g, '');;
  setsquareInfo(result);
}

export const handleMetroInfo = (event,setMetroInfo) => {
  const result = event.value;
  setMetroInfo(result);
}

export const handleRayonInfo = (event,setRayonInfo) => {
  const result = event.value;
  setRayonInfo(result);
}

export const handleDescriptionInfo = (event,setdescriptionInfo) => {
  const result = event.value;
  setdescriptionInfo(result);
}

export const handleNameInfo = (event,setNameInfo) => {
  const result = event.value;
  setNameInfo(result);
}

export const handleNumberInfo = (event,setNumberInfo) => {
  const result = event.value;
  setNumberInfo(result);
}

export const handleMailInfo = (event,setMailInfo) => {
  const result = event.value;
  setMailInfo(result);
}

export const handleLinkViberInfo = (event,setLinkViberInfo) => {
  const result = event.value;
  setLinkViberInfo(result);
}

export const handleLinkWhatsInfo = (event,setLinkWatsInfo) => {
  const result = event.value;
  setLinkWatsInfo(result);
}

export const handleLinkMailInfo = (event,setLinkMailInfo) => {
  const result = event.value;
  setLinkMailInfo(result);
}

export const handleDopNamesInfo = (event,setDopNames,checkboxInputValue_moduleChange) => {
  if (checkboxInputValue_moduleChange.value!==""){
    const result = event.value;
    setDopNames(result);
  }
}

export const handleSleepPlaces = (event,setsleepPlaces) => {
    const result = event.value;
    setsleepPlaces(result);
}