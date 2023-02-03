import * as yup from "yup";

export const validationSchemaAdvertisements=yup.object().shape({
  city:yup.string().required(),
  sent:yup.number().required("Неверная цена"),
  rooms:yup.string().required(),
  total:yup.string().required(),
  square:yup.number().required("Неверная площадь"),
  metro:yup.string().required(),
  rayon:yup.string().required(),
  name:yup.string().required(),
  number:yup.string().required(),
  mail:yup.string().email("email неверный").required("email неверный"),
  linkViber:yup.string().required(),
  linkWats:yup.string().required(),
  description:yup.string().required(),
  linkMail:yup.string().email("email неверный").required("email неверный"),
})

export const validationSchemaContacts=yup.object().shape({
  login:yup.string().required("Неверное имя"),
  email:yup.string().email("Неверная почта").required("Введите почту"),
  textArea:yup.string().required("Введите сообщение")
})

export const validationSchemaSignUp = yup.object().shape({
  login:yup.string().required(),
  password:yup.string().min(6).required(),
  password2:yup.string().oneOf([yup.ref("password")],"пароли не совпадают").required("пароли не совпадают"),
  email:yup.string().email("email неверный").required("email неверный"),
})