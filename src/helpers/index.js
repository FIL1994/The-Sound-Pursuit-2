import numeral from "numeral";

export NumberEase from "./NumberEase";
export const formatNumber = v => numeral(v).format()
