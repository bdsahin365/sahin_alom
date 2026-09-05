import { supabase } from './supabase'

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: any
  status: 'draft' | 'published' | 'scheduled'
  category: string
  tags: string[]
  author: string
  featured_image: string
  read_time: number
  meta_title: string
  meta_desc: string
  created_at?: string
  updated_at: string
}

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-ch1-lighting-design',
    title: 'Chapter 1: Lighting Design কী? কেন একটি Building-এ শুধু Light লাগালেই Lighting Design হয় না?',
    slug: 'chapter-1-lighting-design-ki',
    excerpt: 'একটি নতুন বিল্ডিংয়ে কয়েকটি লাইট লাগিয়ে দিলেই কি লাইটিং ডিজাইন হয়ে যায়? জানুন লাইটিং ডিজাইন কী, Watt, Lumen, Lux-এর বাস্তব পার্থক্য এবং BNBC অনুযায়ী ৭ ধাপের প্রফেশনাল লাইটিং ডিজাইন মেথড।',
    status: 'published',
    category: 'Electrical Engineering',
    tags: ['Lighting Design', 'BNBC 2020', 'Building Services', 'Electrical Engineering', 'Lux', 'Lumen'],
    author: 'Md Sahin Alom',
    featured_image: '/img/lighting-design-cover.jpg',
    read_time: 8,
    meta_title: 'Chapter 1: Lighting Design কী? কেন শুধু Light লাগালেই Lighting Design হয় না? — Md Sahin Alom',
    meta_desc: 'বিল্ডিং লাইটিং ডিজাইনের মৌলিক নীতিমালা, Watt বনাম Lumen বনাম Lux-এর ব্যবহারিক বিশ্লেষণ, এবং BNBC 2020 অনুযায়ী প্রফেশনাল ৭-স্টেপ লাইটিং ডিজাইন প্রসেস।',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    content: `
<h2>ভূমিকা: লাইট লাগানো বনাম লাইটিং ডিজাইন</h2>
<p>একটা নতুন কমার্শিয়াল বা রেসিডেন্সিয়াল বিল্ডিং তৈরি হচ্ছে। ফলস সিলিংয়ের কাজ শেষ। এরপর ইলেকট্রিক্যাল কন্ট্রাক্টর বা টেকনিশিয়ান এসে সিলিং মেপে মেপে একটার পর একটা 2x2 LED প্যানেল বা ডাউনলাইট বসিয়ে দিয়ে গেল। সুইচ অন করতেই পুরো ফ্লোর ধবধবে সাদা আলোয় ঝলমল করে উঠল।</p>
<p>বাইরে থেকে দেখলে মনে হবে—<em>"বাহ্! বেশ সুন্দর আলো হয়েছে, ঘর তো বেশ ব্রাইট!"</em></p>
<p>কিন্তু একজন প্রফেশনাল ইলেকট্রিক্যাল বা বিল্ডিং সার্ভিসেস ইঞ্জিনিয়ারের দৃষ্টিকোণ থেকে প্রশ্ন হলো—<strong>সত্যিই কি এই বিল্ডিংয়ের Lighting Design সম্পন্ন হয়েছে?</strong></p>
<blockquote>
  <strong>উত্তর হলো: একদমই না।</strong><br/>
  কারণ একটি রুমে শুধু কয়েকটি ফিক্সচার ঝুলিয়ে দেওয়া আর একটি কমপ্লিট <strong>Lighting Design</strong> সম্পন্ন করা—দুটো সম্পূর্ণ ভিন্ন জিনিস।
</blockquote>
<p>একজন প্রফেশনাল ইঞ্জিনিয়ার যখন একটি স্পেসের লাইটিং ডিজাইন করেন, তখন তিনি কেবল রুমটি কতটা উজ্জ্বল তা দেখেন না। তিনি নিশ্চিত করেন:</p>
<ul>
  <li>নির্দিষ্ট ওয়ার্কিং প্লেনে (Working Plane) কাজের জন্য প্রয়োজনীয় <strong>Lux Level</strong> নিশ্চিত হয়েছে কি না।</li>
  <li>আলো পুরো ফ্লোরে সুষমভাবে (<strong>Uniformity Ratio</strong>) ছড়াচ্ছে কি না।</li>
  <li>কম্পিউটারের মনিটরে বা চোখে অস্বস্তিকর গ্লেয়ার (<strong>UGR - Unified Glare Rating</strong>) তৈরি হচ্ছে কি না।</li>
  <li>এনার্জি কোড অনুযায়ী ওয়াট ডেনসিটি (<strong>LPD - Lighting Power Density</strong>) সীমার মধ্যে আছে কি না।</li>
  <li>পরবর্তীতে রক্ষণাবেক্ষণের কারণে আলোর হ্রাসের জন্য <strong>Maintenance Factor (MF)</strong> ধরা হয়েছে কি না।</li>
</ul>

<hr/>

<h2>১. Lighting Design আসলে কী?</h2>
<p>সহজ কথায়:</p>
<blockquote>
  <strong>Lighting Design</strong> হলো কোনো নির্দিষ্ট স্পেসের অ্যাক্টিভিটি, ব্যবহারকারীর ভিজ্যুয়াল কমফোর্ট এবং আর্কিটেকচারাল বৈশিষ্ট্য অনুযায়ী—সঠিক স্থানে, সঠিক কোয়ালিটি ও কোয়ান্টিটির আলোর সুপরিকল্পিত প্রয়োগ।
</blockquote>
<p>ড্রয়িং টেবিলে বসে কেবল <em>"এই রুমে ৪টা ২০ ওয়াটের টিউবলাইট আর ৩টা ডাউনলাইট লাগবে"</em>—এমন অনুমানের নাম কোনোভাবেই লাইটিং ডিজাইন নয়। একজন ডিজাইনারকে প্রতিটি স্পেসের জন্য নিচের বিষয়গুলো সমাধান করতে হয়:</p>
<ol>
  <li><strong>Application &amp; Task:</strong> রুমে মানুষ কী কাজ করবে? (অফিস ডেস্ক, সূক্ষ্ম সেলাই, ড্রাফটিং, নাকি শুধু হাঁটাচলা?)</li>
  <li><strong>Target Lux:</strong> কাজের ধরন অনুযায়ী BNBC ও আন্তর্জাতিক স্ট্যান্ডার্ডে কত লাক্স (Lux) প্রয়োজন?</li>
  <li><strong>Room Geometry:</strong> রুমের দৈর্ঘ্য, প্রস্থ, সিলিং ক্লিয়ার হাইট ও মাউন্টিং হাইট কত?</li>
  <li><strong>Working Plane:</strong> মেঝে থেকে কত উচ্চতায় আলো পরিমাপ করতে হবে? (সাধারণত ডেস্ক হাইট 0.75 m - 0.85 m)</li>
  <li><strong>Surface Reflectance:</strong> ছাদ, দেয়াল এবং মেঝের রঙ ও প্রতিফলন ক্ষমতা (Reflectance) কেমন?</li>
  <li><strong>Photometric Performance:</strong> নির্বাচিত ল্যুমিনায়ারের লুমেন আউটপুট, বিম অ্যাঙ্গেল ও ডিস্ট্রিবিউশন কার্ভ কেমন?</li>
  <li><strong>Visual Comfort:</strong> গ্লেয়ার রেটিং (UGR) এবং কালার রেন্ডারিং ইনডেক্স (CRI) চোখের জন্য কতটা আরামদায়ক?</li>
  <li><strong>Emergency Provisions:</strong> মেইন পাওয়ার চলে গেলে ইমার্জেন্সি ও এক্সিট সাইনেজ কীভাবে কাজ করবে?</li>
</ol>

<hr/>

<h2>২. মৌলিক চারটি শব্দ: Watt, Lumen, Lux এবং Candela</h2>
<p>লাইটিং ডিজাইন বুঝতে হলে শুরুতেই এই চারটি পরিমাপকে পরিষ্কারভাবে আলাদা করতে হবে। প্র্যাকটিক্যাল ফিল্ডে অনেকেই ওয়াট আর লাক্সকে গুলিয়ে ফেলেন।</p>

<h3>ক. Watt (W) — পাওয়ার কনজাম্পশন</h3>
<p>এটি আলোর পরিমাণ নয়; এটি হলো <strong>ইলেকট্রিক্যাল পাওয়ারের পরিমাপ</strong>—অর্থাৎ একটি লাইট কতটুকু বিদ্যুৎ খরচ করছে। উদাহরণস্বরূপ, একটি 40 W LED প্যানেল মানে হলো এটি প্রতি ঘণ্টায় প্রায় ৪০ ওয়াট বৈদ্যুতিক শক্তি গ্রহণ করে। এটি কিন্তু বলে না যে ফিক্সচারটি কতটা আলো ছড়াবে।</p>

<h3>খ. Lumen (lm) — মোট আলোর নির্গমন</h3>
<p>একটি লাইট সোর্স (বা ল্যাম্প) থেকে চারদিকে সর্বমোট যে পরিমাণ দৃশ্যমান আলো নির্গত হয়, তাকে লুমেন বলে। কোনো ফিক্সচারের স্পেসিফিকেশনে 4000 lm লেখা থাকার অর্থ এটি চারপাশের পরিবেশে মোট ৪০০০ লুমেন আলো ছড়াচ্ছে।</p>

<h3>গ. Lux (lx) — সারফেসে পতিত আলো (Illuminance)</h3>
<p>কোনো নির্দিষ্ট তলে (Surface) প্রতি বর্গমিটারে ঠিক কতটুকু লুমেন আলো এসে পৌঁছাল, তার পরিমাপ হলো লাক্স (1 Lux = 1 Lumen/m²)।</p>

<p>গাণিতিক সূত্র:</p>
<p>$$E = \\frac{\\Phi}{A}$$</p>
<p>যেখানে, $E$ = Illuminance in Lux (lx), $\\Phi$ = Luminous Flux in Lumens (lm), এবং $A$ = Surface Area in Square Meters (m²)।</p>

<blockquote>
  💡 <strong>এক নজরে মনে রাখার সহজ অ্যানালজি:</strong><br/>
  ধরুন, আপনার কাছে <strong>১০ লিটার পানি</strong> আছে।<br/>
  • এই ১০ লিটার পানি = <strong>Lumen</strong> (মোট রিসোর্স)।<br/>
  • আপনি এই পানি একটি ছোট বালতিতে ঢাললেন—বালতি কানায় কানায় ভরে গেল (High Density = <strong>High Lux</strong>)।<br/>
  • একই ১০ লিটার পানি একটি বড় সুইমিং পুলে ঢাললেন—মেঝে কোনোমতে একটু ভিজল মাত্র (Low Density = <strong>Low Lux</strong>)।
</blockquote>

<h3>তুলনামূলক সামারি টেবিল</h3>
<table>
  <thead>
    <tr>
      <th>টার্ম</th>
      <th>একক</th>
      <th>প্রতীক</th>
      <th>কী নির্দেশ করে?</th>
      <th>বাস্তব অ্যানালজি</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Watt</strong></td>
      <td>Watt</td>
      <td>W</td>
      <td>বিদ্যুতের খরচ বা ইনপুট পাওয়ার</td>
      <td>পাম্পের বিদ্যুৎ খরচ</td>
    </tr>
    <tr>
      <td><strong>Lumen</strong></td>
      <td>Lumen</td>
      <td>lm</td>
      <td>সোর্স থেকে নির্গত মোট আলো</td>
      <td>পাইপ দিয়ে বের হওয়া মোট পানি</td>
    </tr>
    <tr>
      <td><strong>Candela</strong></td>
      <td>Candela</td>
      <td>cd</td>
      <td>নির্দিষ্ট অভিমুখে আলোর তীব্রতা</td>
      <td>নোজল দিয়ে পানির জেট স্প্রে</td>
    </tr>
    <tr>
      <td><strong>Lux</strong></td>
      <td>Lux</td>
      <td>lx</td>
      <td>সারফেসে প্রাপ্ত আলোর ঘনত্ব</td>
      <td>মেঝেতে জমা হওয়া পানির গভীরতা</td>
    </tr>
  </tbody>
</table>

<hr/>

<h2>৩. লাইটিং ডিজাইন কেন এত গুরুত্বপূর্ণ?</h2>
<p>একটি ভবনে প্রয়োজনের চেয়ে <strong>কম আলো</strong> দেওয়া যেমন অপরাধ, অপ্রয়োজনীয়ভাবে <strong>অতিরিক্ত আলো</strong> দেওয়াও সমান ক্ষতিকর।</p>
<ul>
  <li><strong>ভিজ্যুয়াল অ্যাকুইটি ও ক্লান্তি রোধ:</strong> অফিসে বা ক্লাসরুমে পর্যাপ্ত লাক্স না থাকলে চোখের ওপর অতিরিক্ত চাপ পড়ে, দৃষ্টিশক্তি ক্ষতিগ্রস্ত হয় এবং মাথা ব্যথার সমস্যা তৈরি হয়।</li>
  <li><strong>গ্লেয়ার নিয়ন্ত্রণ (Glare Control):</strong> অতিরিক্ত আলো মনিটরে বা চকচকে টেবিলে প্রতিফলিত হয়ে অন্ধত্বের মতো অবস্থা তৈরি করে (Disability Glare)।</li>
  <li><strong>কাজের সঠিক পরিবেশ (Ergonomics):</strong> গার্মেন্টস ফ্যাক্টরির ফেব্রিক ইন্সপেকশনে রঙের শেড মেলানোর জন্য যেমন হাই লাক্স ও হাই CRI প্রয়োজন, তেমনি হাসপাতালের আইসিইউ বা রোগীর বেডে শান্ত ও ডিমেবল লাইটিং দরকার।</li>
  <li><strong>এনার্জি এফিশিয়েন্সি:</strong> অতিরিক্ত ল্যাম্প মানেই অতিরিক্ত পাওয়ার এবং সিলিংয়ে অতিরিক্ত তাপ উৎপাদন—যা ভবনের HVAC (এয়ার কন্ডিশনিং) লোড এবং বিদ্যুৎ বিল বাড়িয়ে দেয়।</li>
</ul>

<hr/>

<h2>৪. প্রফেশনাল লাইটিং ডিজাইনের ৭টি ধাপ (Workflow)</h2>
<p>প্রফেশনাল লাইটিং ডিজাইনে কাজ হয় একটি ধারাবাহিক বৈজ্ঞানিক পদ্ধতিতে:</p>

<pre><code class="language-mermaid">graph TD
    A[ধাপ ১: স্পেসের ব্যবহার ও অ্যাক্টিভিটি বিশ্লেষণ] --> B[ধাপ ২: টার্গেট Lux নির্ধারণ - BNBC 2020]
    B --> C[ধাপ ৩: রুম জিওমেট্রি ও রিফ্লেক্ট্যান্স ডাটা সংগ্রহ]
    C --> D[ধাপ ৪: উপযুক্ত Luminaire ও অপটিক্স নির্বাচন]
    D --> E[ধাপ ৫: লুমেন মেথডে গাণিতিক হিসাব ও ফিক্সচার সংখ্যা]
    E --> F[ধাপ ৬: ফিক্সচার গ্রিড লেআউট ও সুষম স্পেসিং]
    F --> G[ধাপ ৭: DIALux সিমুলেশন ও ফিল্ড ভেরিফিকেশন]
</code></pre>

<ol>
  <li><strong>রুমের ব্যবহার বুঝুন:</strong> রেসিডেন্সিয়াল লিভিং রুম আর ড্রয়িং অফিসের ভিজ্যুয়াল টাস্ক এক নয়।</li>
  <li><strong>Required Lux নির্ধারণ করুন:</strong> কোড বুক অনুযায়ী মিনিমাম এবং রিকমেন্ডেড লাক্স চিহ্নিত করুন।</li>
  <li><strong>রুম ডাটা নিন:</strong> দৈর্ঘ্য, প্রস্থ, ক্লিয়ার হাইট এবং সিলিং ও দেয়ালের কালার শেড (Reflectance) রেকর্ড করুন।</li>
  <li><strong>Luminaire নির্বাচন করুন:</strong> মাউন্টিং টাইপ (Recessed, Surface, Suspended), CCT (Color Temperature), CRI (≥80) এবং লুমেন এফিকেসি (lm/W) যাচাই করুন।</li>
  <li><strong>Calculation করুন:</strong> লুমেন মেথড ব্যবহার করে Utilization Factor (UF) ও Maintenance Factor (MF) ধরে মোট প্রয়োজনীয় ফিক্সচার সংখ্যা বের করুন।</li>
  <li><strong>লেআউট ও স্পেসিং:</strong> লাইটগুলো এমনভাবে সাজান যাতে আলো সমানভাবে ছড়ায় এবং কোনাকানি অন্ধকার জোন তৈরি না হয়।</li>
  <li><strong>সিমুলেশন ও ভেরিফিকেশন:</strong> DIALux evo-তে থ্রি-ডি মডেল তৈরি করে আইসোলাক্স কার্ভ ও ফলস কালার রেন্ডারিংয়ের মাধ্যমে যাচাই করুন।</li>
</ol>

<hr/>

<h2>৫. ফিক্সচার নাকি Luminaire?</h2>
<p>ইঞ্জিনিয়ারিং স্পেসিফিকেশন ও বিওকিউ (BOQ) লেখার সময় আমরা প্রায়ই একটি টার্ম দেখি—<strong>Luminaire</strong>।</p>
<blockquote>
  <strong>Luminaire হলো একটি সম্পূর্ণ লাইটিং ইউনিট (Complete Fitting)।</strong><br/>
  এর মধ্যে শুধু আলোর সোর্স (LED চিপ বা ল্যাম্প) থাকে না; বরং এতে অন্তর্ভুক্ত থাকে:
  <ul>
    <li><strong>Lamp / LED Module:</strong> আলোর মূল উৎস</li>
    <li><strong>Optical System / Diffuser:</strong> আলো ছড়িয়ে দেওয়ার বা গ্লেয়ার কমানোর লেন্স বা প্রিজম্যাটিক কভার</li>
    <li><strong>Gear / LED Driver:</strong> ভোল্টেজ ও কারেন্ট কন্ট্রোলিং ইলেকট্রনিক সার্কিট</li>
    <li><strong>Housing &amp; Heat Sink:</strong> তাপ নির্গমন এবং কাঠামোগত সুরক্ষার অ্যালুমিনিয়াম বডি</li>
    <li><strong>Mounting Accessories:</strong> সিলিংয়ে সুরক্ষিতভাবে আটকানোর ফ্রেম ও ওয়্যারিং টার্মিনাল</li>
  </ul>
</blockquote>

<hr/>

<h2>৬. রিয়েল-ওয়ার্ল্ড কেস স্টাডি: একটি গার্মেন্টস সুইং ফ্লোর</h2>
<p>বিষয়টি সহজে বোঝার জন্য আসুন একটি বাস্তব উদাহরণ দেখি। ধরুন, গাজীপুরের একটি গার্মেন্টস কারখানার সুইং ফ্লোর:</p>
<ul>
  <li><strong>দৈর্ঘ্য:</strong> 30 m</li>
  <li><strong>প্রস্থ:</strong> 20 m</li>
  <li><strong>মোট এরিয়া:</strong> 600 m²</li>
</ul>

<h3>অ-প্রকৌশলগত পদ্ধতি:</h3>
<p>একজন সাধারণ টেকনিশিয়ান বলল—<em>"ভাই, ফ্লোরটা বেশ বড়। এখানে সমান দূরত্বে ১০০টা ৪০ ওয়াটের ব্যাটেন লাইট ঝুলিয়ে দেন। ফ্লোর একদম দিনের মতো ফকফকা হয়ে যাবে!"</em></p>

<h3>ইঞ্জিনিয়ারিং পদ্ধতি:</h3>
<p>একজন কোয়ালিফাইড ইলেকট্রিক্যাল ডিজাইনারের কাছে এই প্রস্তাব গ্রহণযোগ্য নয়। তিনি নিচের বিষয়গুলো সমাধান করবেন:</p>
<ul>
  <li><strong>টাস্ক অ্যানালাইসিস:</strong> সুইং ফ্লোরে সূক্ষ্ম সুঁই ও কালার শেড নিয়ে কাজ হয়। BNBC ও বায়ার স্ট্যান্ডার্ড অনুযায়ী সুইং নিডেল পয়েন্টে ন্যূনতম <strong>500 Lux</strong> প্রয়োজন।</li>
  <li><strong>মাউন্টিং হাইট:</strong> ফিক্সচার কি সিলিংয়ে লাগবে নাকি ট্রাঙ্কিং দিয়ে সুইং টেবিল থেকে 1.8 m উপরে সাসপেন্ড করা হবে?</li>
  <li><strong>Maintenance Factor (MF):</strong> কাপড়ের ডাস্ট ও ফাইবার ওড়ার কারণে লাইটের কভারে ধুলো জমবে। তাই এখানে রক্ষণাবেক্ষণ ফ্যাক্টর 0.75 - 0.80 ধরতে হবে।</li>
  <li><strong>Uniformity (U₀):</strong> প্রতিটি মেশিনের উপর আলো যেন সমান হয়, তার জন্য ইউনিফরমিটি রেশিও অবশ্যই $U_0 \\ge 0.60$ হতে হবে।</li>
</ul>

<hr/>

<h2>৭. এখানে BNBC 2020-এর ভূমিকা কোথায়?</h2>
<p>একজন ইলেকট্রিক্যাল ডিজাইনার যখন বাংলাদেশে কোনো ভবনের নকশা করেন, তখন তাকে অবশ্যই <strong>Bangladesh National Building Code (BNBC 2020)</strong> মেনে চলতে হয়।</p>
<p>BNBC 2020-এর <strong>Part 8 (Building Services), Chapter 1 (Electrical and Electronic Engineering Services)</strong>-এ স্পষ্টভাবে কৃত্রিম আলো ও ইলুমিনেশন সংক্রান্ত বিস্তারিত নির্দেশনা দেওয়া আছে:</p>
<ul>
  <li>বিভিন্ন অকুপেন্সির জন্য রিকমেন্ডেড লাক্স লেভেল চার্ট।</li>
  <li>এনার্জি সংরক্ষণের জন্য ম্যাক্সিমাম অ্যালাউয়েবল <strong>Lighting Power Density (LPD - W/m²)</strong>।</li>
  <li>এস্কেপ রুট, করিডোর এবং সিঁড়ির জন্য <strong>ইমার্জেন্সি লাইটিং স্ট্যান্ডার্ড</strong>।</li>
  <li>লুমেন মেথড ও লাইটিং ক্যালকুলেশনের নিয়মাবলী।</li>
</ul>

<hr/>

<h2>📌 Chapter 1 থেকে যা যা শিখলাম (Key Takeaways)</h2>
<ul>
  <li>✔ <strong>Light লাগানো আর Lighting Design এক নয়:</strong> সঠিক স্থানে পর্যাপ্ত, সুষম ও চোখের জন্য আরামদায়ক আলো দেওয়াই ডিজাইনের উদ্দেশ্য।</li>
  <li>✔ <strong>Watt vs Lux:</strong> ওয়াট দিয়ে বিদ্যুৎ খরচ বোঝায়, কিন্তু কাজের সারফেসে কাজের উপযোগী আলো কতটা পৌঁছাল তা পরিমাপ করা হয় Lux দিয়ে।</li>
  <li>✔ <strong>Lumen হলো মোট আলোর পরিমাণ:</strong> সোর্স মোট কত আলো তৈরি করছে তা Lumen ($lm$), আর প্রতি বর্গমিটারে প্রাপ্ত আলো হলো Lux ($lx = lm/m^2$)।</li>
  <li>✔ <strong>Luminaire একটি সম্পূর্ণ ইউনিট:</strong> ল্যাম্প, ডিফিউজার, ড্রাইভার এবং হিটসিঙ্কের সমন্বিত কাঠামোকে লুমিনায়ার বলে।</li>
  <li>✔ <strong>ডিজাইনের সঠিক সিকোয়েন্স:</strong> Space ➔ Task ➔ BNBC Lux ➔ Luminaire ➔ Calculation ➔ Layout ➔ Simulation.</li>
</ul>

<hr/>

<h2>✍️ লেখকের নোট ও পরবর্তী চ্যাপ্টার প্রিভিউ</h2>
<blockquote>
  প্রফেশনাল ফিল্ডে কাজ শুরু করার পর আমি একটা কথা সবসময় মনে রাখি—<em>"যে ডিজাইন দেখতে খুব উজ্জ্বল কিন্তু মানুষের চোখে অস্বস্তি তৈরি করে কিংবা অপ্রয়োজনীয় বিদ্যুৎ অপচয় করে, তা একজন ইঞ্জিনিয়ারের ব্যর্থতা।"</em><br/>
  লাইটিং ডিজাইনের প্রকৃত সৌন্দর্য নিহিত রয়েছে ভিজ্যুয়াল কমফোর্ট, বিদ্যুৎ সাশ্রয় এবং নান্দনিকতার নিখুঁত ভারসাম্যে।
</blockquote>

<h3>🔜 পরবর্তী পর্বে আসছে:</h3>
<p><strong>Chapter 2: Lux ও Lumen-এর গভীরে — BNBC 2020 অনুযায়ী বিভিন্ন স্পেসে কত Lux দরকার?</strong></p>
<ul>
  <li>বিভিন্ন স্পেসের (অফিস, কনফারেন্স রুম, মিটিং রুম, করিডোর, লাইব্রেরি, ল্যাবরেটরি) জন্য কোড অনুযায়ী স্ট্যান্ডার্ড লাক্স তালিকা।</li>
  <li>ক্লায়েন্টের বাজেট ও রিকোয়ারমেন্ট অনুযায়ী নিখুঁত লাক্স লেভেল সিলেক্ট করার নিয়ম।</li>
  <li>লাক্স মিটার দিয়ে সাইটে সঠিক পদ্ধতিতে আলো পরিমাপ করার কৌশল।</li>
</ul>
`
  }
]

const STORAGE_KEY = 'msa_articles_v1'

function getStoredArticles(): Article[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.warn('Error reading local articles storage:', e)
  }
  // Initialize with seed articles
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES))
  } catch {}
  return INITIAL_ARTICLES
}

function saveStoredArticles(articles: Article[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
  } catch (e) {
    console.warn('Error saving local articles storage:', e)
  }
}

/**
 * Fetch all published articles for public view
 */
export async function fetchPublishedArticles(): Promise<Article[]> {
  const local = getStoredArticles().filter(a => a.status === 'published')
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })

    if (!error && data && data.length > 0) {
      // Merge supabase articles with local articles
      const map = new Map<string, Article>()
      local.forEach(a => map.set(a.id, a))
      data.forEach(a => map.set(a.id, a))
      const merged = Array.from(map.values())
      saveStoredArticles(merged)
      return merged.filter(a => a.status === 'published')
    }
  } catch (err) {
    console.warn('Supabase fetch published articles fallback:', err)
  }
  return local
}

/**
 * Fetch all articles (for admin dashboard)
 */
export async function fetchAllArticles(): Promise<Article[]> {
  const local = getStoredArticles()
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('updated_at', { ascending: false })

    if (!error && data && data.length > 0) {
      const map = new Map<string, Article>()
      local.forEach(a => map.set(a.id, a))
      data.forEach(a => map.set(a.id, a))
      const merged = Array.from(map.values())
      saveStoredArticles(merged)
      return merged
    }
  } catch (err) {
    console.warn('Supabase fetch all articles fallback:', err)
  }
  return local
}

/**
 * Fetch a single article by slug
 */
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const local = getStoredArticles().find(a => a.slug === slug)
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (!error && data) return data
  } catch (err) {
    console.warn('Supabase fetch by slug fallback:', err)
  }
  return local || null
}

/**
 * Fetch a single article by ID
 */
export async function fetchArticleById(id: string): Promise<Article | null> {
  const local = getStoredArticles().find(a => a.id === id)
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()

    if (!error && data) return data
  } catch (err) {
    console.warn('Supabase fetch by ID fallback:', err)
  }
  return local || null
}

export interface SaveArticleResult {
  article: Article
  synced: boolean
  error?: string
}

/**
 * Save or update article in local cache and reliably sync to Supabase database
 */
export async function saveArticle(article: Partial<Article> & { title: string }): Promise<SaveArticleResult> {
  const all = getStoredArticles()
  const now = new Date().toISOString()
  
  const id = article.id || `art-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const slug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  
  const fullArticle: Article = {
    id,
    title: article.title,
    slug,
    excerpt: article.excerpt || '',
    content: article.content || '',
    status: article.status || 'draft',
    category: article.category || 'General',
    tags: article.tags || [],
    author: article.author || 'Md Sahin Alom',
    featured_image: article.featured_image || '',
    read_time: article.read_time || 5,
    meta_title: article.meta_title || article.title,
    meta_desc: article.meta_desc || article.excerpt || '',
    created_at: article.created_at || now,
    updated_at: now,
  }

  // Update local storage
  const existingIdx = all.findIndex(a => a.id === id)
  if (existingIdx >= 0) {
    all[existingIdx] = fullArticle
  } else {
    all.unshift(fullArticle)
  }
  saveStoredArticles(all)

  // Direct sync to Supabase database
  let synced = false
  let errorMsg: string | undefined = undefined

  try {
    const { error } = await supabase.from('articles').upsert(fullArticle)
    if (error) {
      console.error('Supabase database sync error:', error)
      errorMsg = error.message
    } else {
      synced = true
    }
  } catch (e: any) {
    console.warn('Supabase database exception:', e)
    errorMsg = e?.message || 'Database connection error'
  }

  return { article: fullArticle, synced, error: errorMsg }
}

/**
 * Delete article from local cache and sync delete with Supabase
 */
export async function deleteArticle(id: string): Promise<{ success: boolean; error?: string }> {
  const all = getStoredArticles().filter(a => a.id !== id)
  saveStoredArticles(all)
  try {
    const { error } = await supabase.from('articles').delete().eq('id', id)
    if (error) {
      console.warn('Supabase delete error:', error)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (e: any) {
    console.warn('Supabase delete failed:', e)
    return { success: false, error: e?.message }
  }
}
