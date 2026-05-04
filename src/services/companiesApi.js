export const fetchCompanies = async () => {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await res.json();

    // تحويل البيانات لشكل شركتك
    return data.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      city: item.address.city,
      score: Math.floor(Math.random() * 40) + 60, // نسبة عشوائية
    }));
  } catch (e) {
    throw e;
  }
};