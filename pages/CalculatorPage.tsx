
import React, { useState } from 'react';
import { Calculator, TrendingUp, Target, Award, ChevronRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

type CalculatorType = 'TYT' | 'AYT' | 'LGS';

interface TYTResults {
  turkce: number;
  matematik: number;
  sosyal: number;
  fen: number;
  total: number;
}

interface AYTResults {
  matematik: number;
  fizik: number;
  kimya: number;
  biyoloji: number;
  edebiyat: number;
  tarih1: number;
  cografya1: number;
  tarih2: number;
  cografya2: number;
  felsefe: number;
  din: number;
  total: number;
}

interface LGSResults {
  turkce: number;
  matematik: number;
  fen: number;
  inkılap: number;
  din: number;
  ingilizce: number;
  total: number;
}

const CalculatorPage: React.FC = () => {
  // SEO Hook
  useSEO('calculator');
  
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('TYT');
  const [tytNets, setTytNets] = useState({ turkce: 0, matematik: 0, sosyal: 0, fen: 0 });
  const [aytNets, setAytNets] = useState({
    matematik: 0, fizik: 0, kimya: 0, biyoloji: 0,
    edebiyat: 0, tarih1: 0, cografya1: 0, tarih2: 0, cografya2: 0, felsefe: 0, din: 0
  });
  const [lgsNets, setLgsNets] = useState({ turkce: 0, matematik: 0, fen: 0, inkılap: 0, din: 0, ingilizce: 0 });
  const [tytResults, setTytResults] = useState<TYTResults | null>(null);
  const [aytResults, setAytResults] = useState<AYTResults | null>(null);
  const [lgsResults, setLgsResults] = useState<LGSResults | null>(null);

  // Basit puan hesaplama (gerçekçi değil, örnek amaçlı)
  const calculateTYT = () => {
    const turkcePuan = tytNets.turkce * 3.3;
    const matematikPuan = tytNets.matematik * 3.3;
    const sosyalPuan = tytNets.sosyal * 3.4;
    const fenPuan = tytNets.fen * 3.4;
    const total = turkcePuan + matematikPuan + sosyalPuan + fenPuan + 100; // Base score

    setTytResults({
      turkce: Math.round(turkcePuan),
      matematik: Math.round(matematikPuan),
      sosyal: Math.round(sosyalPuan),
      fen: Math.round(fenPuan),
      total: Math.round(total)
    });
  };

  const calculateAYT = () => {
    const matematikPuan = aytNets.matematik * 3;
    const fizikPuan = aytNets.fizik * 2.8;
    const kimyaPuan = aytNets.kimya * 3.07;
    const biyolojiPuan = aytNets.biyoloji * 3.07;
    const edebiyatPuan = aytNets.edebiyat * 3;
    const tarih1Puan = aytNets.tarih1 * 2.8;
    const cografya1Puan = aytNets.cografya1 * 3.33;
    const tarih2Puan = aytNets.tarih2 * 2.91;
    const cografya2Puan = aytNets.cografya2 * 2.91;
    const felsefePuan = aytNets.felsefe * 3;
    const dinPuan = aytNets.din * 3.33;
    const total = matematikPuan + fizikPuan + kimyaPuan + biyolojiPuan +
      edebiyatPuan + tarih1Puan + cografya1Puan + tarih2Puan + cografya2Puan + felsefePuan + dinPuan + 100;

    setAytResults({
      matematik: Math.round(matematikPuan),
      fizik: Math.round(fizikPuan),
      kimya: Math.round(kimyaPuan),
      biyoloji: Math.round(biyolojiPuan),
      edebiyat: Math.round(edebiyatPuan),
      tarih1: Math.round(tarih1Puan),
      cografya1: Math.round(cografya1Puan),
      tarih2: Math.round(tarih2Puan),
      cografya2: Math.round(cografya2Puan),
      felsefe: Math.round(felsefePuan),
      din: Math.round(dinPuan),
      total: Math.round(total)
    });
  };

  const calculateLGS = () => {
    const turkcePuan = lgsNets.turkce * 4;
    const matematikPuan = lgsNets.matematik * 4;
    const fenPuan = lgsNets.fen * 4;
    const inkılapPuan = lgsNets.inkılap * 1;
    const dinPuan = lgsNets.din * 1;
    const ingilizcePuan = lgsNets.ingilizce * 1;
    const total = turkcePuan + matematikPuan + fenPuan + inkılapPuan + dinPuan + ingilizcePuan + 100;

    setLgsResults({
      turkce: Math.round(turkcePuan),
      matematik: Math.round(matematikPuan),
      fen: Math.round(fenPuan),
      inkılap: Math.round(inkılapPuan),
      din: Math.round(dinPuan),
      ingilizce: Math.round(ingilizcePuan),
      total: Math.round(total)
    });
  };

  const handleCalculate = () => {
    if (activeCalculator === 'TYT') calculateTYT();
    else if (activeCalculator === 'AYT') calculateAYT();
    else calculateLGS();
  };

  const resetForm = () => {
    setTytNets({ turkce: 0, matematik: 0, sosyal: 0, fen: 0 });
    setAytNets({
      matematik: 0, fizik: 0, kimya: 0, biyoloji: 0,
      edebiyat: 0, tarih1: 0, cografya1: 0, tarih2: 0, cografya2: 0, felsefe: 0, din: 0
    });
    setLgsNets({ turkce: 0, matematik: 0, fen: 0, inkılap: 0, din: 0, ingilizce: 0 });
    setTytResults(null);
    setAytResults(null);
    setLgsResults(null);
  };

  return (
    <div className="min-h-screen mesh-bg pb-24">
      {/* Header */}
      <section className="bg-brand-dark py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/assets/sliders/zemin.png" className="w-full h-full object-cover opacity-60" alt="" />
          <div className="absolute inset-0 bg-brand-dark/40"></div>
        </div>

        <div className="max-w-[1600px] mx-auto px-12 relative z-10 text-center">
          <div className="inline-flex items-center space-x-3 text-brand-blue font-black uppercase text-xs tracking-widest bg-brand-blue/20 backdrop-blur-xl px-8 py-4 rounded-2xl mb-10 border border-brand-blue/30">
            <Calculator className="w-6 h-6" />
            <span>Puan Hesaplama Araçları</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-8 capitalize">
            Sınav Puanınızı <span className="text-brand-blue italic">Hesaplayın</span>
          </h1>
          <p className="text-slate-200 text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
            Net sayılarınızı girerek yaklaşık sınav puanınızı hesaplayabilirsiniz.
          </p>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-12 -mt-20 relative z-20">
        {/* Calculator Tabs */}
        <div className="bg-white rounded-[20px] shadow-2xl border border-slate-100 p-6 mb-12 overflow-x-auto">
          <div className="flex items-center justify-center space-x-4 min-w-max">
            {(['TYT', 'AYT', 'LGS'] as CalculatorType[]).map((type) => (
              <button
                key={type}
                onClick={() => setActiveCalculator(type)}
                className={`px-10 py-5 rounded-xl text-base font-black tracking-wide transition-all duration-300 ${activeCalculator === type
                  ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/30 scale-105'
                  : 'bg-brand-gray text-slate-600 hover:bg-slate-100 hover:text-brand-dark'
                  }`}
              >
                {type} Puan Hesaplama
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-[20px] shadow-2xl border border-slate-100 p-10">
            <h2 className="text-3xl font-black text-brand-dark mb-8">
              {activeCalculator} Net Sayıları
            </h2>

            {activeCalculator === 'TYT' && (
              <div className="space-y-6">
                {[
                  { key: 'turkce', label: 'Türkçe Net' },
                  { key: 'matematik', label: 'Matematik Net' },
                  { key: 'sosyal', label: 'Sosyal Bilimler Net' },
                  { key: 'fen', label: 'Fen Bilimleri Net' }
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-black text-slate-600 uppercase tracking-widest mb-3">
                      {field.label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={tytNets[field.key as keyof typeof tytNets]}
                      onChange={(e) => setTytNets({ ...tytNets, [field.key]: parseFloat(e.target.value) || 0 })}
                      className="w-full px-6 py-4 bg-brand-gray rounded-xl text-lg font-black text-brand-dark border-2 border-transparent focus:border-brand-blue focus:outline-none transition-all"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeCalculator === 'AYT' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-brand-dark mb-4">Sayısal</h3>
                  {[
                    { key: 'matematik', label: 'Matematik' },
                    { key: 'fizik', label: 'Fizik' },
                    { key: 'kimya', label: 'Kimya' },
                    { key: 'biyoloji', label: 'Biyoloji' }
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-black text-slate-600 uppercase tracking-widest mb-3">
                        {field.label} Net
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="40"
                        value={aytNets[field.key as keyof typeof aytNets]}
                        onChange={(e) => setAytNets({ ...aytNets, [field.key]: parseFloat(e.target.value) || 0 })}
                        className="w-full px-6 py-4 bg-brand-gray rounded-xl text-lg font-black text-brand-dark border-2 border-transparent focus:border-brand-blue focus:outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-brand-dark mb-4">Eşit Ağırlık / Sözel</h3>
                  {[
                    { key: 'edebiyat', label: 'Türk Dili ve Edebiyatı' },
                    { key: 'tarih1', label: 'Tarih-1' },
                    { key: 'cografya1', label: 'Coğrafya-1' },
                    { key: 'tarih2', label: 'Tarih-2' },
                    { key: 'cografya2', label: 'Coğrafya-2' },
                    { key: 'felsefe', label: 'Felsefe' },
                    { key: 'din', label: 'Din Kültürü' }
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-black text-slate-600 uppercase tracking-widest mb-3">
                        {field.label} Net
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={aytNets[field.key as keyof typeof aytNets]}
                        onChange={(e) => setAytNets({ ...aytNets, [field.key]: parseFloat(e.target.value) || 0 })}
                        className="w-full px-6 py-4 bg-brand-gray rounded-xl text-lg font-black text-brand-dark border-2 border-transparent focus:border-brand-blue focus:outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeCalculator === 'LGS' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'turkce', label: 'Türkçe Net' },
                  { key: 'matematik', label: 'Matematik Net' },
                  { key: 'fen', label: 'Fen Bilimleri Net' },
                  { key: 'inkılap', label: 'T.C. İnkılap Tarihi Net' },
                  { key: 'din', label: 'Din Kültürü Net' },
                  { key: 'ingilizce', label: 'İngilizce Net' }
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-black text-slate-600 uppercase tracking-widest mb-3">
                      {field.label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={lgsNets[field.key as keyof typeof lgsNets]}
                      onChange={(e) => setLgsNets({ ...lgsNets, [field.key]: parseFloat(e.target.value) || 0 })}
                      className="w-full px-6 py-4 bg-brand-gray rounded-xl text-lg font-black text-brand-dark border-2 border-transparent focus:border-brand-blue focus:outline-none transition-all"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex space-x-4 mt-10">
              <button
                onClick={handleCalculate}
                className="flex-1 px-8 py-5 bg-brand-blue text-white font-black rounded-xl hover:bg-brand-dark hover:shadow-xl hover:shadow-brand-blue/30 transition-all duration-300 flex items-center justify-center space-x-3 group"
              >
                <Calculator className="w-6 h-6" />
                <span>Hesapla</span>
              </button>
              <button
                onClick={resetForm}
                className="px-8 py-5 bg-brand-gray text-brand-dark font-black rounded-xl hover:bg-slate-200 transition-all duration-300"
              >
                Sıfırla
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-1">
            {(tytResults || aytResults || lgsResults) && (
              <div className="bg-gradient-to-br from-brand-blue to-brand-indigo rounded-[20px] shadow-2xl p-10 text-white">
                <div className="flex items-center space-x-3 mb-8">
                  <Award className="w-8 h-8" />
                  <h3 className="text-2xl font-black">Sonuçlar</h3>
                </div>

                {activeCalculator === 'TYT' && tytResults && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Türkçe</span>
                        <span className="text-lg font-black">{tytResults.turkce}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Matematik</span>
                        <span className="text-lg font-black">{tytResults.matematik}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Sosyal</span>
                        <span className="text-lg font-black">{tytResults.sosyal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Fen</span>
                        <span className="text-lg font-black">{tytResults.fen}</span>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-white/20">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-black">Toplam Puan</span>
                        <span className="text-4xl font-black">{tytResults.total}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeCalculator === 'AYT' && aytResults && (
                  <div className="space-y-6">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Matematik</span>
                        <span className="text-lg font-black">{aytResults.matematik}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Fizik</span>
                        <span className="text-lg font-black">{aytResults.fizik}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Kimya</span>
                        <span className="text-lg font-black">{aytResults.kimya}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Biyoloji</span>
                        <span className="text-lg font-black">{aytResults.biyoloji}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Edebiyat</span>
                        <span className="text-lg font-black">{aytResults.edebiyat}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Tarih-1</span>
                        <span className="text-lg font-black">{aytResults.tarih1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Coğrafya-1</span>
                        <span className="text-lg font-black">{aytResults.cografya1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Tarih-2</span>
                        <span className="text-lg font-black">{aytResults.tarih2}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Coğrafya-2</span>
                        <span className="text-lg font-black">{aytResults.cografya2}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Felsefe</span>
                        <span className="text-lg font-black">{aytResults.felsefe}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Din</span>
                        <span className="text-lg font-black">{aytResults.din}</span>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-white/20">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-black">Toplam Puan</span>
                        <span className="text-4xl font-black">{aytResults.total}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeCalculator === 'LGS' && lgsResults && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Türkçe</span>
                        <span className="text-lg font-black">{lgsResults.turkce}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Matematik</span>
                        <span className="text-lg font-black">{lgsResults.matematik}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Fen</span>
                        <span className="text-lg font-black">{lgsResults.fen}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">İnkılap</span>
                        <span className="text-lg font-black">{lgsResults.inkılap}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">Din</span>
                        <span className="text-lg font-black">{lgsResults.din}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-bold text-white/80">İngilizce</span>
                        <span className="text-lg font-black">{lgsResults.ingilizce}</span>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-white/20">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-black">Toplam Puan</span>
                        <span className="text-4xl font-black">{lgsResults.total}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                  <p className="text-xs font-bold text-white/70 leading-relaxed">
                    * Bu hesaplama yaklaşık bir değerdir. Gerçek sınav puanınız net sayıları, standart sapma ve diğer faktörlere göre değişebilir.
                  </p>
                </div>
              </div>
            )}

            {!tytResults && !aytResults && !lgsResults && (
              <div className="bg-white rounded-[20px] shadow-2xl border border-slate-100 p-10 text-center">
                <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-400 font-bold">Net sayılarınızı girip "Hesapla" butonuna tıklayın</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
