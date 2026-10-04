export const DEFAULT_CITY = "الخليل";

export const createEmptyAddressForm = () => ({
  label: "",
  fullName: "",
  streetAddress: "",
  city: DEFAULT_CITY,
  state: "",
  zipCode: "",
  phoneNumber: "",
  isDefault: true,
});
