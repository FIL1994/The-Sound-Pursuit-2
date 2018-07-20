import numeral from "numeral";

export NumberEase from "./NumberEase";

export const formatNumber = v => numeral(v).format();
export const formatMoney = v => numeral(v).format("$0,0.00");
export const formatDecimal = v => numeral(v).format("0.00");
