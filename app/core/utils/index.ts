import dayjs from "dayjs";
import auth from "./auth/auth";
import { error } from "console";
import numeral from "numeral";
import Cookies from "js-cookie";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import theme from "@/routes/customers/components/sub-product-into-customer/theme";
import { t } from "i18next";

export const replaceData = (data: string) => {
  return !data ? "-" : data;
};

export const dateFormated = (date: Date | string): string => {
  let result = !date ? "-" : `${dayjs(date).format("DD/MM/YYYY HH:mm:ss")}`;
  return result;
};

export const dateStamp = (date: Date | string): string => {
  return `${dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]")}`;
};

export const checkErrorResponse = (err: any) => {
  const { redirectToLogin } = auth();
  const errorCode = err?.response?.status;

  console.log("checkErrorResponse active", typeof errorCode);
  switch (errorCode) {
    case 401:
      return redirectToLogin();
    default:
      break;
  }
};

export const containsSpecialCharacters = (input: string) => {
  const regex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{1,255}$/; // You can adjust this regex based on your requirements
  console.log("testttt", regex.test(input));
  return !regex.test(input);
};

export const handleHideText = (textHide: string, maxLength: number) => {
  return textHide && textHide.length > maxLength
    ? textHide.slice(0, maxLength) + "..."
    : textHide;
};

export function generateNewPassword() {
  return Math.random().toString(36).substring(2, 15);
}

export function replaceHttpsLinkNote(link: string) {
  return link?.replace(
    /href="(?!https:\/\/)([^"]*)/g,
    (match, p1) => `href="https://${p1.toLowerCase()}`,
  );
}

export const ValidJSON = (str: string) => {
  if (typeof str !== "string") return false;

  const trimmed = str.trim();
  if (
    !(trimmed.startsWith("{") && trimmed.endsWith("}")) &&
    !(trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    return false;
  }

  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

export const ParseJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) throw new Error("Invalid token format");

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse JWT:", error);
    return null; // Return null or handle as needed
  }
};

export const formatNumber = (num: number) => {
  return numeral(num).format("0,0.00");
};

export const formatThousandSeparator = (num: number) => {
  const myNum = numeral(Number(num));
  return myNum.format("0, 0.[00]");
};

export const truncateText = (html: string, maxLength: number): string => {
  const plainText = html.replace(/<\/?[^>]+(>|$)/g, "");
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + "..."
    : plainText;
};

export const formatDateLanguage = (dateStr: string) => {
  const language = Cookies.get("LANGUAGE");

  const [monthStr, yearStr] = dateStr.split('/');
  const month = parseInt(monthStr);
  const year = parseInt(yearStr);

  if (isNaN(month) || isNaN(year)) {
    console.warn('Invalid date:', dateStr);
    return '-';
  }

  const date = dayjs(`${year}-${month}-01`).toDate();

  return new Intl.DateTimeFormat(
    language === 'th' ? 'th-TH' : 'en-US',
    {
      month: 'short',
      year: 'numeric',
    }
  ).format(date);
};

export const phoneUtil = PhoneNumberUtil.getInstance();

export const getPlaceholder = (countryCode: string) => {
  try {
    const exampleNumber = phoneUtil.getExampleNumberForType(
      countryCode,
      1, // MOBILE (0 = FIXED_LINE)
    );

    // ฟอร์แมตเบอร์เป็นรูปแบบท้องถิ่น (National) เช่น 812 345 678
    const formattedNumber = phoneUtil.format(
      exampleNumber,
      PhoneNumberFormat.NATIONAL,
    );

    // คืนผลลัพธ์โดยตรงโดยที่ยังคงช่องว่างไว้ตามฟอร์แมต
    return formattedNumber;
  } catch (error) {
    return "";
  }
};

export const getPatternFromPlaceholder = (placeholder: string) => {
  return placeholder.replace(/\d/g, "#"); // แทนเลขทั้งหมดด้วย `#`
};

export const getCountryByDialCode = (dialCode: string) => {
  const regionCodes = phoneUtil.getRegionCodesForCountryCode(
    parseInt(dialCode.replace("+", ""), 10),
  );

  return regionCodes.length ? regionCodes[0] : null; // คืนค่าโค้ดประเทศตัวแรกที่พบ
};

export const getFontColorOfPrefix = (status: string) => {
  let fontColor = "";
  if (status === "SUCCESS") {
    fontColor = theme.palette.success.main;
  } else if (status === "PENDING") {
    fontColor = theme.palette.error.main;
  }
  return fontColor;
};

export const getMessageOfPrefixByStatus = (status: string) => {
  let prefixStatus = "";
  if (status === "SUCCESS") {
    prefixStatus = t("billing.wl-ready");
  } else if (status === "PENDING") {
    prefixStatus = t("billing.wl-not-ready");
  } else {
    prefixStatus = t("billing.wl-no-prefix");
  }
  return prefixStatus;
};

export const getEnvironment = () => {
  const hostname = window.location.hostname;
  if (hostname === "localhost") return "loc";
  if (hostname.includes("dev")) return "dev";
  if (hostname.includes("sit")) return "sit";
  if (hostname.includes("uat")) return "uat";
  return "";
};