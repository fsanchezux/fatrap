'use client'

import React from 'react'

export default function DIYRecommendations() {
  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="max-w-3xl mx-auto px-8 md:px-12 py-10">

        {/* Header */}
        <h2 className="text-base font-bold text-black mb-4">rapid FAQS</h2>

        {/* Intro */}
        <p className="text-sm text-gray-800 leading-relaxed mb-3">
          This section aims to compile websites, brands, materials and general recommendations with what I have been learning over the years.
        </p>

        <p className="text-sm text-gray-800 leading-relaxed mb-1">
          Websites for placing orders, today there are more but these are the ones I have tried the most:
        </p>
        <ul className="text-sm text-gray-800 mb-3 space-y-0.5 pl-2">
          <li>– printful (always try to get, at minimum, Gildan brand)</li>
          <li>– gelato (always try to get, at minimum, Gildan brand)</li>
        </ul>

        <p className="text-sm text-gray-800 leading-relaxed mb-1">
          But really, with the files you have here, any print shop can stamp them and it will surely be cheaper.
        </p>
        <p className="text-sm text-gray-800 leading-relaxed mb-4">
          Image sizes are already real size, so print shops don&apos;t need to touch anything. Always print without background.
        </p>

        {/* Brands */}
        <p className="text-sm text-gray-800 leading-relaxed mb-1">
          Regarding garments I can recommend the following brands:
        </p>
        <ul className="text-sm text-gray-800 mb-1 space-y-0.5 pl-2">
          <li>– T-shirts:</li>
        </ul>
        <ul className="text-sm text-gray-800 mb-3 space-y-1 pl-6">
          <li>
            – <span className="font-medium">Gildan</span>: it&apos;s a reliable basic, quality is not bad, they&apos;re not the cheapest but they do the job.
          </li>
          <li>
            – <span className="font-medium">James &amp; Nicolson JN002</span>: the one we&apos;ve used the most, the quality/price ratio is very hard to beat.
          </li>
          <li>
            – <span className="font-medium">kanban 3008</span>: oversize t-shirts, unbeatable quality/price ratio, my basic favorites — perfect thickness and the oversize cut is done right (Much better than Build your brand). Also comes without a brand label, only shows the size.
          </li>
        </ul>

        <ul className="text-sm text-gray-800 mb-1 space-y-0.5 pl-2">
          <li>– Where to buy these garments?:</li>
        </ul>
        <ul className="text-sm text-gray-800 mb-8 space-y-0.5 pl-6">
          <li>
            – the go-to store is{' '}
            <a
              href="https://www.wordans.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600 transition-colors"
            >
              wordans.com
            </a>
            , I&apos;m not going to elaborate much here because on Google you&apos;ll find a thousand sites, but in the end the price doesn&apos;t vary much and wordans usually has everything. Watch out because prices usually don&apos;t include VAT.
          </li>
        </ul>

        {/* 3 Steps */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {/* Step 1 */}
          <div>
            <p className="text-xs text-gray-500 mb-0.5">STEP 1</p>
            <p className="text-sm font-bold text-black mb-2 uppercase">Download the design</p>
            <ul className="text-sm text-gray-700 space-y-0.5">
              <li>+ Mockup</li>
              <li>+ Print instructions</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div>
            <p className="text-xs text-gray-500 mb-0.5">STEP 2</p>
            <p className="text-sm font-bold text-black uppercase">Choose your garment</p>
          </div>

          {/* Step 3 */}
          <div>
            <p className="text-xs text-gray-500 mb-0.5">STEP 3</p>
            <p className="text-sm font-bold text-black mb-1 uppercase leading-tight">
              Send it to your trusted print shop
            </p>
            <p className="text-xs text-gray-500 leading-snug">
              (Attach the mockup and the print instructions to make sure you don&apos;t fail)
            </p>
          </div>
        </div>

        {/* Bottom card */}
        <div className="bg-gray-100 rounded-2xl px-7 py-6">
          <p className="text-sm text-gray-800 leading-relaxed">
            If you want to edit any of the files, we also give you the editable vectors, so you can edit
            to your taste and let your creativity flow. The files are in &ldquo;Affinity&rdquo;. Which is
            the free editing software equivalent to Canva. If you don&apos;t have it you can download it
            at the following link:{' '}
            <a
              href="https://affinity.serif.com/en-gb/designer/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 transition-colors"
            >
              download Affinity here
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}
