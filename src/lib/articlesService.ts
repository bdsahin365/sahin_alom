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

<h2>৪. প্রফেশনাল লাইটিং ডিজাইনের ৭টি ধাপ (Workflow Diagram)</h2>
<p>প্রফেশনাল লাইটিং ডিজাইনে কাজ হয় একটি ধারাবাহিক বৈজ্ঞানিক পদ্ধতিতে:</p>

<div data-type="mermaid-block" data-fig="Fig. 1" data-caption="BNBC 2020 Standard Lighting Design 7-Step Engineering Workflow" data-category="LIGHTING ENGINEERING WORKFLOW" data-voltage="BNBC 2020 Part 8 / IESNA RP-7" data-standard="BNBC 2020 Part 8 Chap 1">
  <div class="mermaid-render-zone">
    <pre class="mermaid">graph TD
    classDef step fill:#FAF8F5,stroke:#C47D0E,stroke-width:2px,color:#0F172A;
    classDef code fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E;
    classDef sim fill:#DCFCE7,stroke:#16A34A,stroke-width:2px,color:#166534;

    S1[Step 1: Space Activity & Visual Task Analysis]:::step --> S2[Step 2: Target Lux Selection - BNBC 2020 Part 8]:::code
    S2 --> S3[Step 3: Room Geometry L, W, H & Reflectances]:::step
    S3 --> S4[Step 4: Luminaire Selection - Efficacy lm/W, CCT, CRI]:::step
    S4 --> S5[Step 5: Lumen Method Mathematical Calculation - UF, MF]:::code
    S5 --> S6[Step 6: Fixture Grid Layout & Spacing Uniformity U0]:::step
    S6 --> S7[Step 7: DIALux evo 3D Simulation & Glare Check UGR]:::sim
    </pre>
  </div>
</div>

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

<h2>৬. রিয়েল-ওয়ার্ল্ড ইঞ্জিনিয়ারিং ক্যালকুলেশন: একটি গার্মেন্টস সুইং ফ্লোর</h2>
<p>বিষয়টি সহজে বোঝার জন্য আসুন একটি বাস্তব গাণিতিক ডিজাইন দেখি। ধরুন, গাজীপুরের একটি গার্মেন্টস কারখানার সুইং ফ্লোর:</p>
<ul>
  <li><strong>দৈর্ঘ্য:</strong> 30 m</li>
  <li><strong>প্রস্থ:</strong> 20 m</li>
  <li><strong>মোট এরিয়া:</strong> 600 m²</li>
  <li><strong>টার্গেট লাক্স (BNBC 2020):</strong> 500 Lux (সেলাই ও সূক্ষ্ম কাটিংয়ের জন্য)</li>
</ul>

<div data-type="calc-block" data-attrs="%7B%22title%22%3A%22Garments%20Sewing%20Floor%20Lighting%20Design%20(BNBC%202020)%22%2C%22category%22%3A%22INTERIOR%20LIGHTING%20DESIGN%22%2C%22standardRef%22%3A%22BNBC%202020%20Part%208%20Chap%201%20%2F%20IESNA%20RP-7%22%2C%22given%22%3A%5B%7B%22label%22%3A%22Target%20Illuminance%20(E)%22%2C%22symbol%22%3A%22E%22%2C%22value%22%3A%22500%22%2C%22unit%22%3A%22Lux%20(lx)%22%2C%22note%22%3A%22BNBC%20Standard%20for%20Garment%20Sewing%20%26%20Inspection%22%7D%2C%7B%22label%22%3A%22Room%20Dimensions%20(L%20%C3%97%20W)%22%2C%22symbol%22%3A%22L%20%5C%5Ctimes%20W%22%2C%22value%22%3A%2230m%20%C3%97%2020m%20(600%20m%C2%B2)%22%2C%22unit%22%3A%22%22%2C%22note%22%3A%22Clear%20working%20floor%20area%22%7D%2C%7B%22label%22%3A%22Working%20Height%20%2F%20Mounting%20Height%22%2C%22symbol%22%3A%22H_m%22%2C%22value%22%3A%222.5%22%2C%22unit%22%3A%22m%22%2C%22note%22%3A%22Height%20from%20working%20plane%20(0.8m)%20to%20luminaire%22%7D%2C%7B%22label%22%3A%22Selected%20Luminaire%20Flux%20(%CE%A6)%22%2C%22symbol%22%3A%22%5C%5CPhi%22%2C%22value%22%3A%224000%22%2C%22unit%22%3A%22Lumens%20(lm)%22%2C%22note%22%3A%2240W%20High-Efficiency%20LED%20Panel%20(100%20lm%2FW)%22%7D%2C%7B%22label%22%3A%22Utilization%20Factor%20(UF)%22%2C%22symbol%22%3A%22UF%22%2C%22value%22%3A%220.62%22%2C%22unit%22%3A%22%22%2C%22note%22%3A%22Based%20on%20Room%20Index%20K%3D2.4%20and%2070%2F50%2F20%20reflectances%22%7D%2C%7B%22label%22%3A%22Maintenance%20Factor%20(MF)%22%2C%22symbol%22%3A%22MF%22%2C%22value%22%3A%220.80%22%2C%22unit%22%3A%22%22%2C%22note%22%3A%22Clean%20industrial%20environment%20with%20regular%20cleaning%22%7D%5D%2C%22formula%22%3A%22N%20%3D%20%5C%5Cfrac%7BE%20%5C%5Ctimes%20A%7D%7Bn%20%5C%5Ctimes%20%5C%5CPhi%20%5C%5Ctimes%20UF%20%5C%5Ctimes%20MF%7D%22%2C%22nomenclature%22%3A%5B%7B%22symbol%22%3A%22N%22%2C%22meaning%22%3A%22Total%20Number%20of%20Luminaires%20Required%22%2C%22unit%22%3A%22fixtures%22%7D%2C%7B%22symbol%22%3A%22E%22%2C%22meaning%22%3A%22Required%20Maintained%20Illuminance%22%2C%22unit%22%3A%22Lux%20(lm%2Fm%C2%B2)%22%7D%2C%7B%22symbol%22%3A%22A%22%2C%22meaning%22%3A%22Total%20Working%20Floor%20Area%20(600%20m%C2%B2)%22%2C%22unit%22%3A%22m%C2%B2%22%7D%2C%7B%22symbol%22%3A%22%5C%5CPhi%22%2C%22meaning%22%3A%22Luminous%20Flux%20per%20Luminaire%20(4000%20lm)%22%2C%22unit%22%3A%22Lumens%22%7D%2C%7B%22symbol%22%3A%22UF%22%2C%22meaning%22%3A%22Utilization%20Factor%20(Coefficients%20of%20Utilization)%22%2C%22unit%22%3A%22dimensionless%22%7D%2C%7B%22symbol%22%3A%22MF%22%2C%22meaning%22%3A%22Maintenance%20Factor%20(Aging%20%26%20Dust%20depreciation)%22%2C%22unit%22%3A%22dimensionless%22%7D%5D%2C%22steps%22%3A%5B%7B%22title%22%3A%22Calculate%20Gross%20Floor%20Working%20Area%22%2C%22math%22%3A%22A%20%3D%2030%20%5C%5Ctext%7B%20m%7D%20%5C%5Ctimes%2020%20%5C%5Ctext%7B%20m%7D%20%3D%20600%20%5C%5Ctext%7B%20m%7D%5E2%22%2C%22explanation%22%3A%22Total%20horizontal%20working%20plane%20area%20requiring%20uniform%20500%20Lux%20illuminance.%22%7D%2C%7B%22title%22%3A%22Calculate%20Gross%20Required%20Luminous%20Flux%20(%CE%A6total)%22%2C%22math%22%3A%22%5C%5CPhi_%7B%5C%5Ctext%7Btotal%7D%7D%20%3D%20%5C%5Cfrac%7BE%20%5C%5Ctimes%20A%7D%7BUF%20%5C%5Ctimes%20MF%7D%20%3D%20%5C%5Cfrac%7B500%20%5C%5Ctext%7B%20lx%7D%20%5C%5Ctimes%20600%20%5C%5Ctext%7B%20m%7D%5E2%7D%7B0.62%20%5C%5Ctimes%200.80%7D%20%3D%20%5C%5Cfrac%7B300%2C000%7D%7B0.496%7D%20%3D%20604%2C838.71%20%5C%5Ctext%7B%20Lumens%7D%22%2C%22explanation%22%3A%22Gross%20flux%20emitted%20by%20all%20light%20sources%20compensating%20for%20ceiling%20absorption%20and%20dust%20degradation.%22%7D%2C%7B%22title%22%3A%22Calculate%20Number%20of%20Luminaires%20(N)%22%2C%22math%22%3A%22N%20%3D%20%5C%5Cfrac%7B604%2C838.71%20%5C%5Ctext%7B%20lm%7D%7D%7B4000%20%5C%5Ctext%7B%20lm%2Ffixture%7D%7D%20%3D%20151.21%20%5C%5Crightarrow%20%5C%5Ctext%7BRound%20up%20to%20%7D%20152%20%5C%5Ctext%7B%20Fixtures%7D%22%2C%22explanation%22%3A%22Minimum%20number%20of%20fixtures%20needed%20to%20achieve%20average%20maintained%20illuminance%20E%20%E2%89%A5%20500%20Lux.%22%7D%2C%7B%22title%22%3A%22Determine%20Grid%20Layout%20%26%20Lighting%20Power%20Density%20(LPD)%22%2C%22math%22%3A%22%5C%5Ctext%7BGrid%3A%20%7D%2019%20%5C%5Ctext%7B%20Rows%7D%20%5C%5Ctimes%208%20%5C%5Ctext%7B%20Columns%7D%20%3D%20152%20%5C%5Ctext%7B%20Fixtures%7D.%20%5C%5Cquad%20%5C%5Ctext%7BLPD%7D%20%3D%20%5C%5Cfrac%7B152%20%5C%5Ctimes%2040%20%5C%5Ctext%7B%20W%7D%7D%7B600%20%5C%5Ctext%7B%20m%7D%5E2%7D%20%3D%2010.13%20%5C%5Ctext%7B%20W%2Fm%7D%5E2%22%2C%22explanation%22%3A%22Installed%20LPD%20is%2010.13%20W%2Fm%C2%B2%2C%20fully%20compliant%20with%20BNBC%202020%20maximum%20allowable%20limit%20of%2012.0%20W%2Fm%C2%B2.%22%7D%5D%2C%22result%22%3A%22152%20Fixtures%20(19%20%C3%97%208%20Grid)%22%2C%22resultUnit%22%3A%2240W%20LED%20Panels%22%2C%22resultNote%22%3A%22Installed%20Lighting%20Power%20Density%3A%2010.13%20W%2Fm%C2%B2%20(BNBC%20allows%20up%20to%2012.0%20W%2Fm%C2%B2).%20Fixture%20spacing-to-height%20ratio%20(SHR%20%3D%201.25)%20guarantees%20uniformity%20U0%20%E2%89%A5%200.65%20with%20low%20glare%20UGR%20%3C%2019.%22%2C%22equipmentSpecs%22%3A%5B%7B%22label%22%3A%22Total%20Luminaire%20Count%22%2C%22value%22%3A%22152%20Units%20(40W%202x2%20LED)%22%2C%22badge%22%3A%22BNBC%20Compliant%22%7D%2C%7B%22label%22%3A%22Lighting%20Power%20Density%22%2C%22value%22%3A%2210.13%20W%2Fm%C2%B2%20(Max%2012%20W%2Fm%C2%B2)%22%2C%22badge%22%3A%22PASS%22%7D%2C%7B%22label%22%3A%22Uniformity%20Ratio%20(U0)%22%2C%22value%22%3A%22%E2%89%A5%200.65%20(Even%20Distribution)%22%2C%22badge%22%3A%22Good%22%7D%5D%7D">
</div>

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
  },
  {
    id: 'art-ch2-substation-sld',
    title: 'Chapter 2: 33kV/11kV/415V Substation Single Line Diagram (SLD) ও Transformer Sizing ক্যালকুলেশন',
    slug: 'chapter-2-substation-sld-transformer-sizing',
    excerpt: 'একটি ইন্ডাস্ট্রিয়াল পাওয়ার সাবস্টেশনের সিঙ্গেল লাইন ডায়াগ্রাম (SLD) কীভাবে পড়তে ও ডিজাইন করতে হয়? জানুন VCB, ACB, PFI, Busbar Sizing এবং 1000 kVA ট্রান্সফরমারের সম্পূর্ণ গাণিতিক হিসাব।',
    status: 'published',
    category: 'Electrical Engineering',
    tags: ['Substation', 'Single Line Diagram', 'SLD', 'Transformer Sizing', 'VCB', 'ACB', 'PFI', 'BNBC 2020'],
    author: 'Md Sahin Alom',
    featured_image: '/img/lighting-design-cover.jpg',
    read_time: 12,
    meta_title: 'Chapter 2: Substation Single Line Diagram (SLD) ও Transformer Sizing — Md Sahin Alom',
    meta_desc: '33kV/11kV/415V ইন্ডাস্ট্রিয়াল সাবস্টেশন সিঙ্গেল লাইন ডায়াগ্রাম (SLD) অ্যানালাইসিস এবং 1000 kVA ট্রান্সফরমার ফুল লোড কারেন্ট ও বাসবার সাইজিং ক্যালকুলেশন।',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    content: `
<h2>ভূমিকা: Single Line Diagram (SLD) কেন পাওয়ার সিস্টেমের প্রাণ?</h2>
<p>একজন ইলেকট্রিক্যাল ইঞ্জিনিয়ারের কাছে একটি ইন্ডাস্ট্রি বা পাওয়ার প্ল্যান্টের <strong>Single Line Diagram (SLD)</strong> হলো একটি মানচিত্রের মতো। গ্রিড ইনকামার থেকে শুরু করে শেষ প্রান্তের মোটর বা লাইটিং প্যানেল পর্যন্ত বিদ্যুৎ কীভাবে প্রবাহিত হচ্ছে, কোথায় কী সুরক্ষামূলক সুইচগিয়ার (Protection Switchgear) বসানো আছে—তা এক নজরে বোঝার একমাত্র উপায় হলো SLD।</p>

<hr/>

<h2>১. 33kV / 11kV / 0.415kV Substation Single Line Diagram</h2>
<p>নিচে একটি স্ট্যান্ডার্ড ইন্ডাস্ট্রিয়াল ডিস্ট্রিবিউশন সাবস্টেশনের পূর্ণাঙ্গ সিঙ্গেল লাইন ডায়াগ্রাম দেওয়া হলো:</p>

<div data-type="mermaid-block" data-fig="Fig. 1" data-caption="33kV / 11kV / 0.415kV Industrial Substation Single Line Diagram (SLD)" data-category="SUBSTATION POWER DISTRIBUTION" data-voltage="33kV HT / 11kV MT / 0.415kV LT" data-standard="BNBC 2020 Part 8 / IEC 60076 / IEEE 141">
  <div class="mermaid-render-zone">
    <pre class="mermaid">graph TD
    classDef grid fill:#FEE2E2,stroke:#DC2626,stroke-width:2px,color:#991B1B;
    classDef tx fill:#FEF3C7,stroke:#C47D0E,stroke-width:2px,color:#92400E;
    classDef sw fill:#E0E7FF,stroke:#4338CA,stroke-width:2px,color:#3730A3;
    classDef load fill:#DCFCE7,stroke:#16A34A,stroke-width:2px,color:#166534;

    Grid([33kV National Grid Incomer]):::grid --> LA[33kV Lightning Arrester]
    LA --> ISO1[33kV Gang Isolator & Earth Switch]
    ISO1 --> VCB33[33kV Vacuum Circuit Breaker - VCB]
    VCB33 --> PT[Power Transformer 33kV/11kV 5MVA]:::tx
    PT --> VCB11[11kV Incomer VCB Switchgear]:::sw
    VCB11 --> Bus11((11kV Main Busbar)):::sw
    
    Bus11 --> DT1[Dist. Transformer 11kV/0.415kV 1000kVA]:::tx
    Bus11 --> DT2[Dist. Transformer 11kV/0.415kV 1000kVA]:::tx
    
    DT1 --> ACB1[2000A LT Main ACB]:::sw
    DT2 --> ACB2[2000A LT Main ACB]:::sw
    
    ACB1 --> BusLT((415V Main LT Switchboard)):::sw
    ACB2 --> BusLT
    
    BusLT --> PFI[350 kVAr Automatic PFI Bank]:::load
    BusLT --> MDB1[MDB 1 - Production Plant]:::load
    BusLT --> MDB2[MDB 2 - HVAC & Utility]:::load
    </pre>
  </div>
</div>

<hr/>

<h2>২. সাবস্টেশন ইকুইপমেন্ট ও সিম্বলের ব্যাখ্যা</h2>
<ul>
  <li><strong>Lightning Arrester (LA):</strong> লাইটনিং বা গ্রিড স্যুইচিংয়ের হাই-ভোল্টেজ সার্জ থেকে ট্রান্সফরমারকে রক্ষা করে সার্জ গ্রাউন্ডে ডিসচার্জ করে দেয়।</li>
  <li><strong>Vacuum Circuit Breaker (VCB):</strong> 11kV/33kV মিডিয়াম ভোল্টেজ সিস্টেমে শর্ট সার্কিট ফল্ট মুহূর্তে মাত্র কয়েক মিলিসেকেন্ডে ভ্যাকুয়াম চেম্বারে আর্ক নিভিয়ে সার্কিট বিচ্ছিন্ন করে।</li>
  <li><strong>Air Circuit Breaker (ACB):</strong> 415V লো-ভোল্টেজ মেইন ইনকামারে ব্যবহৃত ড্র-আউট টাইপ ব্রেকার, যাতে ওভারলোড, শর্ট সার্কিট ও আর্থ ফল্টের মাইক্রোপ্রসেসর রিলিজ থাকে।</li>
  <li><strong>Power Factor Improvement (PFI):</strong> ইনডাক্টিভ মোটরের কারণে নষ্ট হওয়া পাওয়ার ফ্যাক্টরকে $\\cos\\phi \\ge 0.98$-এ উন্নীত রাখে এবং জরিমানা থেকে রক্ষা করে।</li>
</ul>

<hr/>

<h2>৩. 1000 kVA Transformer Sizing ও LT Busbar ক্যালকুলেশন</h2>
<p>নিচে একটি 1000 kVA ডিস্ট্রিবিউশন ট্রান্সফরমারের HV ও LV কারেন্ট এবং মেইন বাসবারের পূর্ণাঙ্গ গাণিতিক হিসাব দেওয়া হলো:</p>

<div data-type="calc-block" data-attrs="%7B%22title%22%3A%221000%20kVA%20Substation%20Transformer%20HV%2FLV%20Current%20%26%20Busbar%20Sizing%22%2C%22category%22%3A%22SUBSTATION%20%26%20HV%2FLV%20TRANSFORMER%22%2C%22standardRef%22%3A%22BNBC%202020%20Part%208%20%2F%20IEC%2060076%22%2C%22given%22%3A%5B%7B%22label%22%3A%22Transformer%20Rated%20Capacity%20(S)%22%2C%22symbol%22%3A%22S%22%2C%22value%22%3A%221000%22%2C%22unit%22%3A%22kVA%22%2C%22note%22%3A%22ONAN%20Cast%20Resin%20%2F%20Oil%20Immersed%22%7D%2C%7B%22label%22%3A%22Primary%20High%20Voltage%20(V_HV)%22%2C%22symbol%22%3A%22V_%7BHV%7D%22%2C%22value%22%3A%2211%22%2C%22unit%22%3A%22kV%22%2C%22note%22%3A%2211%2C000%20Volts%20Delta%20Connected%22%7D%2C%7B%22label%22%3A%22Secondary%20Low%20Voltage%20(V_LV)%22%2C%22symbol%22%3A%22V_%7BLV%7D%22%2C%22value%22%3A%22415%22%2C%22unit%22%3A%22V%22%2C%22note%22%3A%22415%20Volts%20Star%20Connected%20(Wye)%22%7D%2C%7B%22label%22%3A%22Transformer%20Percent%20Impedance%20(%25Z)%22%2C%22symbol%22%3A%22%25Z%22%2C%22value%22%3A%225.75%22%2C%22unit%22%3A%22%25%22%2C%22note%22%3A%22IEC%2060076%20Standard%20Impedance%22%7D%5D%2C%22formula%22%3A%22I_%7BLV%7D%20%3D%20%5C%5Cfrac%7BS%20%5C%5Ctimes%2010%5E3%7D%7B%5C%5Csqrt%7B3%7D%20%5C%5Ctimes%20V_%7BLV%7D%7D%2C%20%5C%5Cquad%20I_%7BHV%7D%20%3D%20%5C%5Cfrac%7BS%20%5C%5Ctimes%2010%5E3%7D%7B%5C%5Csqrt%7B3%7D%20%5C%5Ctimes%20V_%7BHV%7D%7D%22%2C%22nomenclature%22%3A%5B%7B%22symbol%22%3A%22S%22%2C%22meaning%22%3A%22Apparent%20Power%20Rating%22%2C%22unit%22%3A%22kVA%22%7D%2C%7B%22symbol%22%3A%22I_%7BLV%7D%22%2C%22meaning%22%3A%22Secondary%20Low%20Voltage%20Full%20Load%20Current%22%2C%22unit%22%3A%22A%22%7D%2C%7B%22symbol%22%3A%22I_%7BHV%7D%22%2C%22meaning%22%3A%22Primary%20High%20Voltage%20Full%20Load%20Current%22%2C%22unit%22%3A%22A%22%7D%2C%7B%22symbol%22%3A%22V_%7BLV%7D%22%2C%22meaning%22%3A%22Nominal%20Secondary%20Voltage%20(415V)%22%2C%22unit%22%3A%22V%22%7D%2C%7B%22symbol%22%3A%22V_%7BHV%7D%22%2C%22meaning%22%3A%22Nominal%20Primary%20Voltage%20(11%2C000V)%22%2C%22unit%22%3A%22V%22%7D%5D%2C%22steps%22%3A%5B%7B%22title%22%3A%22Calculate%20Secondary%20(LV%20415V)%20Full%20Load%20Current%22%2C%22math%22%3A%22I_%7BLV%7D%20%3D%20%5C%5Cfrac%7B1000%20%5C%5Ctimes%201000%7D%7B%5C%5Csqrt%7B3%7D%20%5C%5Ctimes%20415%7D%20%3D%20%5C%5Cfrac%7B1%2C000%2C000%7D%7B718.80%7D%20%3D%201391.24%20%5C%5Ctext%7B%20A%7D%22%2C%22explanation%22%3A%22Rated%20secondary%20phase-to-phase%20current%20delivered%20to%20the%20main%20LT%20panel%20at%20full%20transformer%20load.%22%7D%2C%7B%22title%22%3A%22Calculate%20Primary%20(HV%2011kV)%20Full%20Load%20Current%22%2C%22math%22%3A%22I_%7BHV%7D%20%3D%20%5C%5Cfrac%7B1000%20%5C%5Ctimes%201000%7D%7B%5C%5Csqrt%7B3%7D%20%5C%5Ctimes%2011%2C000%7D%20%3D%20%5C%5Cfrac%7B1%2C000%2C000%7D%7B19%2C052.56%7D%20%3D%2052.49%20%5C%5Ctext%7B%20A%7D%22%2C%22explanation%22%3A%22Nominal%20primary%20current%20drawn%20from%20the%2011kV%20grid%20feeder%20through%20the%20Vacuum%20Circuit%20Breaker%20(VCB).%22%7D%2C%7B%22title%22%3A%22Main%20LT%20Busbar%20Continuous%20Rating%20(125%25%20S.F.)%22%2C%22math%22%3A%22I_%7B%5C%5Ctext%7Bbusbar%7D%7D%20%3D%201391.24%20%5C%5Ctext%7B%20A%7D%20%5C%5Ctimes%201.25%20%3D%201739.05%20%5C%5Ctext%7B%20A%7D%20%5C%5Crightarrow%20%5C%5Ctext%7BSelect%20%7D%202000%20%5C%5Ctext%7B%20A%7D%22%2C%22explanation%22%3A%22Main%20copper%20busbar%20must%20accommodate%20transformer%20short-term%20overload%20capacity%20and%20thermal%20derating%20in%2040%C2%B0C%20ambient.%22%7D%5D%2C%22result%22%3A%221391.24%20A%20(LV)%20%2F%2052.49%20A%20(HV)%22%2C%22resultUnit%22%3A%22Full%20Load%20Current%22%2C%22resultNote%22%3A%22Main%20LT%20Incomer%20Switchgear%3A%202000%20A%204-Pole%20Air%20Circuit%20Breaker%20(ACB)%20with%20Microprocessor%20Trip%20Unit%20(LSIG).%20HT%20Incomer%3A%20630%20A%2011kV%20Vacuum%20Circuit%20Breaker%20(VCB).%22%2C%22equipmentSpecs%22%3A%5B%7B%22label%22%3A%22LT%20Main%20Incomer%22%2C%22value%22%3A%222000%20A%204P%20Drawout%20ACB%22%2C%22badge%22%3A%2250%20kA%20%2F%201s%22%7D%2C%7B%22label%22%3A%22HT%20Incomer%20Breaker%22%2C%22value%22%3A%22630%20A%2011kV%20VCB%20Panel%22%2C%22badge%22%3A%2225%20kA%20%2F%203s%22%7D%2C%7B%22label%22%3A%22LT%20Main%20Busbar%22%2C%22value%22%3A%222%20%C3%97%20(100%20%C3%97%2010%20mm)%20Cu%22%2C%22badge%22%3A%222000%20A%20Rated%22%7D%5D%7D">
</div>

<hr/>

<h2>📌 Chapter 2 Key Takeaways</h2>
<ul>
  <li>✔ <strong>SLD হলো পাওয়ার সিস্টেমের মাস্টার ড্রয়িং:</strong> ভোল্টেজ লেভেল, ট্রান্সফরমার এবং প্রোটেকশন ব্রেকারের সঠিক পজিশন নির্দেশ করে।</li>
  <li>✔ <strong>1000 kVA ট্রান্সফরমার কারেন্ট:</strong> 415V-এ ফুল লোড কারেন্ট $1391.24\\text{ A}$ এবং 11kV-এ $52.49\\text{ A}$।</li>
  <li>✔ <strong>125% বাসবার সেফটি রুল:</strong> ট্রান্সফরমারের ইনকামার বাসবার সাইজিং সবসময় মিনিমাম ১২৫% সেফটি ফ্যাক্টর ধরে করতে হয়।</li>
</ul>
`
  }
]

const STORAGE_KEY = 'msa_articles_v1'

export function getStoredArticles(): Article[] {
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

export function saveStoredArticles(articles: Article[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
  } catch (e) {
    console.warn('Error saving local articles storage:', e)
  }
}

const withTimeout = <T>(promise: PromiseLike<T>, ms = 3500): Promise<T> => {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms)),
  ])
}

/**
 * Fetch all published articles for public view
 */
export async function fetchPublishedArticles(): Promise<Article[]> {
  const local = getStoredArticles().filter(a => a.status === 'published')
  try {
    const res = await withTimeout(
      supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('updated_at', { ascending: false }),
      3500
    ) as any

    if (!res?.error && res?.data && res.data.length > 0) {
      // Merge supabase articles with local articles
      const map = new Map<string, Article>()
      local.forEach(a => map.set(a.id, a))
      res.data.forEach((a: Article) => map.set(a.id, a))
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
    const res = await withTimeout(
      supabase
        .from('articles')
        .select('*')
        .order('updated_at', { ascending: false }),
      3500
    ) as any

    if (!res?.error && res?.data && res.data.length > 0) {
      const map = new Map<string, Article>()
      local.forEach(a => map.set(a.id, a))
      res.data.forEach((a: Article) => map.set(a.id, a))
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
    const res = await withTimeout(
      supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single(),
      3500
    ) as any

    if (!res?.error && res?.data) return res.data
  } catch (err) {
    console.warn('Supabase fetch by slug fallback:', err)
  }
  return local || null
}

/**
 * Fetch a single article by ID or Slug
 */
export async function fetchArticleById(idOrSlug: string): Promise<Article | null> {
  const local = getStoredArticles().find(a => a.id === idOrSlug || a.slug === idOrSlug)
  try {
    const res = await withTimeout(
      supabase
        .from('articles')
        .select('*')
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .limit(1)
        .maybeSingle(),
      3500
    ) as any

    if (!res?.error && res?.data) return res.data
  } catch (err) {
    console.warn('Supabase fetch by ID/slug fallback:', err)
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
