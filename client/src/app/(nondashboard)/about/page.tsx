import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Home, Key, Building2, UserCircle2, ArrowRight } from "lucide-react";
import FooterSection from "../landing/FooterSection";

export default function AboutPage() {
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] flex items-center justify-center">
        <Image
          src="/about/about_hero_bg.png"
          alt="Beautiful suburban house background"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="relative z-10 text-center text-white mt-10">
          <div className="text-sm font-medium mb-4 uppercase tracking-widest text-gray-200">
            Home &gt; Pages &gt; About Us
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">About Us</h1>
        </div>
      </section>

      {/* Elegance Section 1 */}
      <section className="max-w-6xl mx-auto py-24 px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative h-[450px] w-full hidden md:block">
          <div className="absolute left-0 bottom-0 w-3/4 h-[70%] rounded-[2rem] overflow-hidden">
            <Image
              src="/about/about_elegance_1.png"
              alt="House"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 top-0 w-[65%] h-[55%] rounded-2xl overflow-hidden border-8 border-white shadow-2xl">
            <Image
              src="/about/about_elegance_2.png"
              alt="House"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute top-[45%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] flex flex-col gap-2 min-w-[200px] z-10">
            <p className="text-sm font-bold text-gray-800">Our Happy Customer</p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden relative">
                    <Image src={`/about/about_family.png`} alt="Avatar" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="bg-[#c5d82f] text-xs font-bold px-2 py-1 rounded-full flex items-center">
                 ★ 4.8
              </div>
            </div>
          </div>
        </div>
        <div className="block md:hidden h-[300px] relative rounded-2xl overflow-hidden mb-8">
            <Image src="/about/about_elegance_1.png" alt="House" fill className="object-cover" />
        </div>
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
            Embrace the Elegance Our Exclusive Property
          </h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Discover a world of luxury and comfort with our handpicked selection of exclusive properties. We are dedicated to providing you with the best living experiences that cater to your unique lifestyle.
          </p>
          <ul className="space-y-4 mb-8">
            {['Premium Quality', 'Strategic Locations', 'Modern Designs'].map((item, idx) => (
              <li key={idx} className="flex items-center text-gray-800 font-medium text-lg">
                <CheckCircle2 className="w-6 h-6 text-[#c5d82f] mr-3" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-[#f8f9fa] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
             <span className="inline-block bg-[#e9ecef] text-gray-600 px-4 py-1.5 rounded-full text-sm font-bold mb-4 tracking-wider uppercase">
               The Relocation
             </span>
             <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Our Mission & Vision</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center bg-white rounded-3xl overflow-hidden shadow-xl">
             <div className="p-10 md:p-14">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
                  Our Path To Real Estate Excellence
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  We are dedicated to redefining the real estate experience by providing unparalleled service, expert guidance, and access to the finest properties.
                </p>
                
                <h4 className="text-lg font-bold text-gray-900 mb-2">Our Mission</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  To empower our clients to make informed real estate decisions and build lasting wealth through property ownership.
                </p>

                <h4 className="text-lg font-bold text-gray-900 mb-2">Our Vision</h4>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  To be the leading real estate agency known for its integrity, innovation, and unwavering commitment to client success.
                </p>

                <button className="bg-[#c5d82f] text-[#1c352d] font-bold px-8 py-4 rounded-xl hover:bg-[#b0c426] transition-colors">
                  Learn More About Us
                </button>
             </div>
             <div className="relative h-full min-h-[400px] md:min-h-full w-full">
                <Image src="/about/about_mission.png" alt="Mission" fill className="object-cover" />
             </div>
          </div>
        </div>
      </section>

      {/* Elegance Section 2 (Repeated block from image with list) */}
      <section className="max-w-6xl mx-auto py-24 px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative h-[500px] w-full hidden md:block order-2 md:order-1">
           <div className="absolute left-0 top-0 w-[45%] h-[60%] rounded-2xl overflow-hidden shadow-xl z-10">
             <Image src="/about/about_elegance_3.png" alt="Building" fill className="object-cover" />
           </div>
           <div className="absolute right-0 bottom-0 w-[60%] h-[55%] rounded-2xl overflow-hidden shadow-xl">
             <Image src="/about/about_elegance_1.png" alt="House" fill className="object-cover" />
           </div>
           <div className="absolute top-0 right-0 w-[45%] h-[35%] rounded-2xl overflow-hidden shadow-xl">
             <Image src="/about/about_elegance_2.png" alt="House" fill className="object-cover" />
           </div>
           <div className="absolute top-[45%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] flex flex-col gap-2 min-w-[200px] z-20">
            <p className="text-sm font-bold text-gray-800">Our Happy Customer</p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden relative">
                    <Image src={`/about/about_family.png`} alt="Avatar" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="bg-[#c5d82f] text-xs font-bold px-2 py-1 rounded-full flex items-center">
                 ★ 4.8
              </div>
            </div>
          </div>
        </div>
        <div className="block md:hidden h-[300px] relative rounded-2xl overflow-hidden mb-8 order-2">
            <Image src="/about/about_elegance_3.png" alt="House" fill className="object-cover" />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
            Embrace the Elegance Our Exclusive Property
          </h2>
          
          <div className="space-y-6 mb-10">
            <div className="flex gap-4">
               <div className="bg-[#f0f4cd] p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                  <span className="text-[#1c352d] font-bold text-xl">★</span>
               </div>
               <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Global Agents</h4>
                  <p className="text-gray-600 leading-relaxed">Our network of global agents ensures you find the perfect property anywhere in the world.</p>
               </div>
            </div>
            <div className="flex gap-4">
               <div className="bg-[#f0f4cd] p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                  <span className="text-[#1c352d] font-bold text-xl">✨</span>
               </div>
               <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Reimagining Spaces</h4>
                  <p className="text-gray-600 leading-relaxed">We focus on properties that offer innovative and inspiring living spaces.</p>
               </div>
            </div>
            <div className="flex gap-4">
               <div className="bg-[#f0f4cd] p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                  <span className="text-[#1c352d] font-bold text-xl">📍</span>
               </div>
               <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Unmatched Locations</h4>
                  <p className="text-gray-600 leading-relaxed">Our exclusive properties are situated in the most desirable and prime locations.</p>
               </div>
            </div>
          </div>

          <button className="bg-[#c5d82f] text-[#1c352d] font-bold px-8 py-4 rounded-xl hover:bg-[#b0c426] transition-colors">
            Discover More Properties
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#f8f9fa] py-24 px-6">
         <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="inline-block bg-[#e9ecef] text-gray-600 px-4 py-1.5 rounded-full text-sm font-bold mb-4 tracking-wider uppercase">
                Features
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Upgrade To a Smarter Living Experience With Home Automation
              </h2>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-stretch">
               <div className="lg:col-span-4 relative rounded-3xl overflow-hidden h-[400px] lg:h-auto hidden md:block">
                  <Image src="/about/about_interior.png" alt="Interior" fill className="object-cover" />
               </div>
               
               <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
                  {/* Card 1 */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                     <div className="bg-[#f0f4cd] w-12 h-12 rounded-full flex items-center justify-center mb-6">
                        <Home className="text-[#1c352d] w-6 h-6" />
                     </div>
                     <h4 className="text-xl font-bold text-gray-900 mb-4">Buying A Home</h4>
                     <p className="text-gray-600 mb-6 leading-relaxed">
                        Find your dream home with our extensive listings and expert guidance every step of the way.
                     </p>
                     <Link href="#" className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-[#c5d82f] transition-colors">
                        Learn More <ArrowRight className="w-4 h-4 ml-2" />
                     </Link>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                     <div className="bg-[#f0f4cd] w-12 h-12 rounded-full flex items-center justify-center mb-6">
                        <Key className="text-[#1c352d] w-6 h-6" />
                     </div>
                     <h4 className="text-xl font-bold text-gray-900 mb-4">Selling A Home</h4>
                     <p className="text-gray-600 mb-6 leading-relaxed">
                        Get the best value for your property with our strategic marketing and negotiation skills.
                     </p>
                     <Link href="#" className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-[#c5d82f] transition-colors">
                        Learn More <ArrowRight className="w-4 h-4 ml-2" />
                     </Link>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                     <div className="bg-[#f0f4cd] w-12 h-12 rounded-full flex items-center justify-center mb-6">
                        <Home className="text-[#1c352d] w-6 h-6" />
                     </div>
                     <h4 className="text-xl font-bold text-gray-900 mb-4">Renting A Home</h4>
                     <p className="text-gray-600 mb-6 leading-relaxed">
                        Discover a wide range of rental properties that suit your lifestyle and budget perfectly.
                     </p>
                     <Link href="#" className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-[#c5d82f] transition-colors">
                        Learn More <ArrowRight className="w-4 h-4 ml-2" />
                     </Link>
                  </div>
                  {/* Card 4 */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                     <div className="bg-[#f0f4cd] w-12 h-12 rounded-full flex items-center justify-center mb-6">
                        <Building2 className="text-[#1c352d] w-6 h-6" />
                     </div>
                     <h4 className="text-xl font-bold text-gray-900 mb-4">Property Management</h4>
                     <p className="text-gray-600 mb-6 leading-relaxed">
                        Ensure your properties are well-maintained and profitable with our comprehensive services.
                     </p>
                     <Link href="#" className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-[#c5d82f] transition-colors">
                        Learn More <ArrowRight className="w-4 h-4 ml-2" />
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Dream Team Section (Simple placeholder matching the image's limited view) */}
      <section className="py-24 px-6 bg-white">
         <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16">The HouseBox Dream Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {/* Team Members - just basic placeholders */}
               {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                     <div className="w-full aspect-[3/4] bg-gray-100 rounded-2xl mb-4 relative overflow-hidden">
                        <Image src={`/about/about_family.png`} alt="Team Member" fill className="object-cover" />
                     </div>
                     <h4 className="text-lg font-bold text-gray-900">Agent Name</h4>
                     <p className="text-sm text-gray-500">Real Estate Agent</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-[#f8f9fa] py-24 px-6">
         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">A Legacy Of Happy Clients</h2>
               <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl">
                  <Image src="/about/about_family.png" alt="Happy Family" fill className="object-cover" />
               </div>
            </div>
            <div className="bg-white p-10 md:p-14 rounded-3xl shadow-xl border border-gray-100">
               <div className="text-[#c5d82f] text-6xl font-serif leading-none mb-6">&quot;</div>
               <p className="text-gray-700 text-lg md:text-xl font-medium leading-relaxed mb-8 italic">
                  &ldquo;I almost decided to sell my home... I am very impressed with what they do &amp; how they do it with a user-centric philosophy. Managing my own apartment feels simple, easy &amp; secure. It&apos;s truly life saving!&rdquo;
               </p>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-full overflow-hidden relative">
                        <Image src="/about/about_family.png" alt="Avatar" fill className="object-cover" />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900 text-lg">Brenda Mcdonald</h4>
                        <p className="text-sm text-gray-500">Happy Client</p>
                     </div>
                  </div>
                  <div className="font-bold text-xl text-blue-500 flex items-center">
                     <span className="text-blue-500">G</span>
                     <span className="text-red-500">o</span>
                     <span className="text-yellow-500">o</span>
                     <span className="text-blue-500">g</span>
                     <span className="text-green-500">l</span>
                     <span className="text-red-500">e</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-white">
         <div className="max-w-6xl mx-auto bg-[#1c352d] rounded-3xl p-12 md:p-20 relative overflow-hidden">
            {/* Background decorative circles */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 right-[20%] w-[200px] h-[200px] bg-white opacity-5 rounded-full transform translate-y-1/2"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
               <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-xl">
                  Step Into Your Dream Home with HouseBox
               </h2>
               <button type="button" className="bg-[#c5d82f] text-[#1c352d] font-bold px-8 py-4 rounded-xl hover:bg-[#b0c426] transition-colors whitespace-nowrap text-lg shadow-lg">
                  Get Started Today
               </button>
            </div>
         </div>
      </section>

      {/* Footer from Home Page as requested */}
      <FooterSection />
    </div>
  );
}
