/**
 * @fileOverview Provides a rule-based transliteration from Tamil to English.
 * This is a simplified implementation for demonstration purposes.
 */

// A mapping of Tamil characters to their English transliterations.
const transliterationMap: { [key: string]: string } = {
  // Vowels
  'அ': 'a', 'ஆ': 'aa', 'இ': 'i', 'ஈ': 'ii', 'உ': 'u', 'ஊ': 'uu',
  'எ': 'e', 'ஏ': 'ae', 'ஐ': 'ai', 'ஒ': 'o', 'ஓ': 'oo', 'ஔ': 'au',
  // Consonants (as they combine with vowels)
  'க': 'ka', 'கா': 'kaa', 'கி': 'ki', 'கீ': 'kii', 'கு': 'ku', 'கூ': 'kuu', 'கெ': 'ke', 'கே': 'kae', 'கை': 'kai', 'கொ': 'ko', 'கோ': 'koo', 'கௌ': 'kau',
  'ச': 'sa', 'சா': 'saa', 'சி': 'si', 'சீ': 'sii', 'சு': 'su', 'சூ': 'suu', 'செ': 'se', 'சே': 'sae', 'சை': 'sai', 'சொ': 'so', 'சோ': 'soo', 'சௌ': 'sau',
  'ட': 'ta', 'டா': 'taa', 'டி': 'ti', 'டீ': 'tii', 'டு': 'tu', 'டூ': 'tuu', 'டெ': 'te', 'டே': 'tae', 'டை': 'tai', 'டொ': 'to', 'டோ': 'too', 'டௌ': 'tau',
  'த': 'tha', 'தா': 'thaa', 'தி': 'thi', 'தீ': 'thii', 'து': 'thu', 'தூ': 'thuu', 'தெ': 'the', 'தே': 'thae', 'தை': 'thai', 'தொ': 'tho', 'தோ': 'thoo', 'தௌ': 'thau',
  'ப': 'pa', 'பா': 'paa', 'பி': 'pi', 'பீ': 'pii', 'பு': 'pu', 'பூ': 'puu', 'பெ': 'pe', 'பே': 'pae', 'பை': 'pai', 'பொ': 'po', 'போ': 'poo', 'பௌ': 'pau',
  'ற': 'ra', 'றா': 'raa', 'றி': 'ri', 'றீ': 'rii', 'று': 'ru', 'றூ': 'ruu', 'றெ': 're', 'றே': 'rae', 'றை': 'rai', 'றொ': 'ro', 'றோ': 'roo', 'றௌ': 'rau',
  'ய': 'ya', 'யா': 'yaa', 'யி': 'yi', 'யீ': 'yii', 'யு': 'yu', 'யூ': 'yuu', 'யெ': 'ye', 'யே': 'yae', 'யை': 'yai', 'யொ': 'yo', 'யோ': 'yoo', 'யௌ': 'yau',
  'ர': 'ra', 'ரா': 'raa', 'ரி': 'ri', 'ரீ': 'rii', 'ரு': 'ru', 'ரூ': 'ruu', 'ரெ': 're', 'ரே': 'rae', 'ரை': 'rai', 'ரொ': 'ro', 'ரோ': 'roo', 'ரௌ': 'rau',
  'ல': 'la', 'லா': 'laa', 'லி': 'li', 'லீ': 'lii', 'லு': 'lu', 'லூ': 'luu', 'லெ': 'le', 'லே': 'lae', 'லை': 'lai', 'லொ': 'lo', 'லோ': 'loo', 'லௌ': 'lau',
  'ள': 'la', 'ளா': 'laa', 'ளி': 'li', 'ளீ': 'lii', 'ளு': 'lu', 'ளூ': 'luu', 'ளெ': 'le', 'ளே': 'lae', 'ளை': 'lai', 'ளொ': 'lo', 'ளோ': 'loo', 'ளௌ': 'lau',
  'ழ': 'zha', 'ழா': 'zhaa', 'ழி': 'zhi', 'ழீ': 'zhii', 'ழு': 'zhu', 'ழூ': 'zhuu', 'ழெ': 'zhe', 'ழே': 'zhae', 'ழை': 'zhai', 'ழொ': 'zho', 'ழோ': 'zhoo', 'ழௌ': 'zhau',
  'வ': 'va', 'வா': 'vaa', 'வி': 'vi', 'வீ': 'vii', 'வு': 'vu', 'வூ': 'vuu', 'வெ': 've', 'வே': 'vae', 'வை': 'vai', 'வொ': 'vo', 'வோ': 'voo', 'வௌ': 'vau',
  'ம': 'ma', 'மா': 'maa', 'மி': 'mi', 'மீ': 'mii', 'மு': 'mu', 'மூ': 'muu', 'மெ': 'me', 'மே': 'mae', 'மை': 'mai', 'மொ': 'mo', 'மோ': 'moo', 'மௌ': 'mau',
  'ந': 'na', 'நா': 'naa', 'நி': 'ni', 'நீ': 'nii', 'நு': 'nu', 'நூ': 'nuu', 'நெ': 'ne', 'நே': 'nae', 'நை': 'nai', 'நொ': 'no', 'நோ': 'noo', 'நௌ': 'nau',
  'ன': 'na', 'னா': 'naa', 'னி': 'ni', 'னீ': 'nii', 'னு': 'nu', 'னூ': 'nuu', 'னெ': 'ne', 'னே': 'nae', 'னை': 'nai', 'னொ': 'no', 'னோ': 'noo', 'னௌ': 'nau',
  'ண': 'na', 'ணா': 'naa', 'ணி': 'ni', 'ணீ': 'nii', 'ணு': 'nu', 'ணூ': 'nuu', 'ணெ': 'ne', 'ணே': 'nae', 'ணை': 'nai', 'ணொ': 'no', 'ணோ': 'noo', 'ணௌ': 'nau',
  'ஞ': 'nya', 'ஞா': 'nyaa', 'ஞி': 'nyi', 'ஞீ': 'nyii', 'ஞு': 'nyu', 'ஞூ': 'nyuu', 'ஞெ': 'nye', 'ஞே': 'nyae', 'ஞை': 'nyai', 'ஞொ': 'nyo', 'ஞோ': 'nyoo', 'ஞௌ': 'nyau',
  'ங': 'nga', 'ஙா': 'ngaa', 'ஙி': 'ngi', 'ஙீ': 'ngii', 'ஙு': 'ngu', 'ஙூ': 'nguu', 'ஙெ': 'nge', 'ஙே': 'ngae', 'ஙை': 'ngai', 'ஙொ': 'ngo', 'ஙோ': 'ngoo', 'ஙௌ': 'ngau',
  // Grantha
  'ஜ': 'ja', 'ஜா': 'jaa', 'ஜி': 'ji', 'ஜீ': 'jii', 'ஜு': 'ju', 'ஜூ': 'juu', 'ஜெ': 'je', 'ஜே': 'jae', 'ஜை': 'jai', 'ஜொ': 'jo', 'ஜோ': 'joo', 'ஜௌ': 'jau',
  'ஷ': 'sha', 'ஷா': 'shaa', 'ஷி': 'shi', 'ஷீ': 'shii', 'ஷு': 'shu', 'ஷூ': 'shuu', 'ஷெ': 'she', 'ஷே': 'shae', 'ஷை': 'shai', 'ஷொ': 'sho', 'ஷோ': 'shoo', 'ஷௌ': 'shau',
  'ஸ': 'sa', 'ஸா': 'saa', 'ஸி': 'si', 'ஸீ': 'sii', 'ஸு': 'su', 'ஸூ': 'suu', 'ஸெ': 'se', 'ஸே': 'sae', 'ஸை': 'sai', 'ஸொ': 'so', 'ஸோ': 'soo', 'ஸௌ': 'sau',
  'ஹ': 'ha', 'ஹா': 'haa', 'ஹி': 'hi', 'ஹீ': 'hii', 'ஹு': 'hu', 'ஹூ': 'huu', 'ஹெ': 'he', 'ஹே': 'hae', 'ஹை': 'hai', 'ஹொ': 'ho', 'ஹோ': 'hoo', 'ஹௌ': 'hau',
  // Pure consonants (Mei ezhuthukkal)
  'க்': 'k', 'ங்': 'ng', 'ச்': 'ch', 'ஞ்': 'nj', 'ட்': 't', 'ண்': 'n', 'த்': 'th',
  'ந்': 'n', 'ப்': 'p', 'ம்': 'm', 'ய்': 'y', 'ர்': 'r', 'ல்': 'l', 'வ்': 'v',
  'ழ்': 'zh', 'ள்': 'l', 'ற்': 'r', 'ன்': 'n', 'ஜ்': 'j', 'ஷ்': 'sh', 'ஸ்': 's', 'ஹ்': 'h',
};

/**
 * Transliterates a Tamil string into English based on a predefined map.
 * It replaces characters using a regex for greedy matching, which is simple
 * and effective for this purpose.
 * @param tamilWord The word in Tamil script.
 * @returns The transliterated English string.
 */
export function transliterate(tamilWord: string): string {
  if (!tamilWord) return '';

  // Create a regex to match all keys in the map.
  // The keys are sorted by length descending to match longer sequences first (e.g., 'கா' before 'க').
  const regex = new RegExp(Object.keys(transliterationMap).sort((a, b) => b.length - a.length).join('|'), 'g');
  
  return tamilWord.replace(regex, (matched) => transliterationMap[matched]);
}
