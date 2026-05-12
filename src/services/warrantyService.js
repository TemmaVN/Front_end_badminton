const KEY = 'warranty_claims';

// Compress image to small thumbnail for localStorage storage
const compressImage = (file, maxPx = 400, quality = 0.75) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(maxPx / img.width, maxPx / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
};

const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

export const getSerialNumber = (orderDetailId) =>
  `SN-${(Math.abs(orderDetailId * 31337) % 99999999).toString().padStart(8, '0')}`;

export const warrantyService = {
  getAll: () => load(),

  getByUser: (userId) => load().filter((w) => w.customerId === String(userId)),

  getByOrderDetail: (orderDetailId) =>
    load().find((w) => w.orderDetailId === orderDetailId) || null,

  create: async ({ orderId, orderDetailId, productName, serialNumber, reasonCategory, reasonLabel, description, imageFiles, videoFile, customerId, customerName }) => {
    const images = await Promise.all((imageFiles || []).slice(0, 5).map(compressImage));

    const claim = {
      warrantyId: Date.now(),
      orderId,
      orderDetailId,
      productName,
      serialNumber,
      reasonCategory,
      reasonLabel,
      description,
      images,
      videoName: videoFile?.name || null,
      customerId: String(customerId),
      customerName,
      status: 'Chờ xử lý',
      adminNote: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const all = load();
    save([...all, claim]);
    return claim;
  },

  updateStatus: (warrantyId, status, adminNote = '') => {
    const all = load().map((w) =>
      w.warrantyId === warrantyId
        ? { ...w, status, adminNote, updatedAt: new Date().toISOString() }
        : w
    );
    save(all);
  },

  delete: (warrantyId) => {
    save(load().filter((w) => w.warrantyId !== warrantyId));
  },
};
