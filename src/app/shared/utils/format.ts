// https://stackoverflow.com/a/2901298/9843487
export const separateThousands = s => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, ',');