import { City, State } from "country-state-city";

export function createLocationSlug(city, state) {
  if (!city || !state) return "";

  const citySlug = city.toLowerCase().replace(/\s+/g, "-");
  const stateSlug = state.toLowerCase().replace(/\s+/g, "-");

  return `${citySlug}-${stateSlug}`;
}

export function parseLocationSlug(slug) {
  if (!slug || typeof slug !== "string") {
    return { city: null, state: null, isValid: false };
  }

  const slugParts = slug.split("-");

  if (slugParts.length < 2) {
    return { city: null, state: null, isValid: false };
  }

  const cityName = slugParts[0].charAt(0).toUpperCase() + slugParts[0].slice(1);
  const stateName = slugParts
    .slice(1)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const indianStates = State.getStatesOfCountry("IN");
  const stateObj = indianStates.find(
    (state) => state.name.toLowerCase() === stateName.toLowerCase(),
  );

  if (!stateObj) {
    return { city: null, state: null, isValid: false };
  }

  const cities = City.getCitiesOfState("IN", stateObj.isoCode);
  const cityExists = cities.some(
    (city) => city.name.toLowerCase() === cityName.toLowerCase(),
  );

  if (!cityExists) {
    return { city: null, state: null, isValid: false };
  }

  return { city: cityName, state: stateName, isValid: true };
}

export function combineDateTime(date, time) {
  if (!date || !time) return null;

  const [hh, mm] = time.split(":").map(Number);
  const combinedDateTime = new Date(date);
  combinedDateTime.setHours(hh, mm, 0, 0);
  return combinedDateTime;
}

export function generateQRCode() {
  return `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

export function darkenThemeColor(color, amount) {
  const colorWithoutHash = color.replace("#", "");

  const num = parseInt(colorWithoutHash, 16);
  const r = Math.max(0, (num >> 16) - amount * 255);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount * 255);
  const b = Math.max(0, (num & 0x0000ff) - amount * 255);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
