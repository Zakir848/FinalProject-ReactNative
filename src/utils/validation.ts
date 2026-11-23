// Ad və soyad: ən azı 2 söz, hər biri 2+ hərf (Azərbaycan, latın, kiril hərfləri)
export const FULLNAME_REGEX =
  /^[A-Za-zƏəĞğİıÖöŞşÜüÇçА-Яа-яЁё]{2,}(?:[ '-][A-Za-zƏəĞğİıÖöŞşÜüÇçА-Яа-яЁё]{2,})+$/;

// E-poçt: ad@domen.zona
export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Şəkil faylı: yalnız jpg / jpeg / png / webp / heic
export const IMAGE_MIME_REGEX = /^image\/(jpe?g|png|webp|heic)$/i;
export const IMAGE_EXT_REGEX = /\.(jpe?g|png|webp|heic)$/i;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
