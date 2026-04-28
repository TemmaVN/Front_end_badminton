import React from 'react'

const Categories = () => {
    const categories = [
        { name: 'Rackets', count: 450, image: '🏸' },
        { name: 'Shoes', count: 120, image: '👟' },
        { name: 'Shuttlecocks', count: 85, image: '🏸' },
        { name: 'Apparel', count: 210, image: '👕' },
    ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {categories.map((cat, i) => (
        <div key={i} className="bg-white/80 dark:bg-slate-900/80 p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 text-center hover:border-orange-500 transition-all cursor-pointer shadow-sm group">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.image}</div>
          <h4 className="font-bold text-slate-800 dark:text-white">{cat.name}</h4>
          <p className="text-sm text-slate-500 mt-1">{cat.count} Products</p>
        </div>
      ))}
    </div>
  );
}

export default Categories