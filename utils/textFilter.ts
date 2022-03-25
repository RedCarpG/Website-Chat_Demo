/** utils/textFilter.ts
 * 
 */

import BadWordsFilter from "bad-words";

const badWordsFilter = new BadWordsFilter();
export function cleanBacWords(text: string) {
    if (badWordsFilter.isProfane(text)) {
      const cleaned = badWordsFilter.clean(text);
      return `🤐 Profane words detected: ${cleaned} ❌`;
    }
    return text
}

export default badWordsFilter;