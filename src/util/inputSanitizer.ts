import * as sanitizeHtml from "sanitize-html";

import * as _ from "lodash";

const InputSanitizer = function (): void {
  const relaxedOptions = {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'ul',
      'br', 'p', 'u'],
    allowedAttributes: {
      'a': ['href']
    }
  };

  const allowedTags:any = [];
  const restrictedOptions = {
    allowedTags: allowedTags,
    allowedAttributes: {},
    textFilter: function (text:any) {
      return text.replace(/&amp;/, '&');
    }
  };

  function trimWhiteSpaces(blip:any) {
    const processedBlip:any = {};
    _.forOwn(blip, function (value:any, key:any) {
      processedBlip[key.trim()] = value.trim();
    });
    return processedBlip;
  }

  const self: any = {};
  self.sanitize = function (rawBlip:any) {
    const blip:any = trimWhiteSpaces(rawBlip);
    blip.description = sanitizeHtml(blip.description, relaxedOptions);
    blip.name = sanitizeHtml(blip.name, restrictedOptions);
    blip.isNew = sanitizeHtml(blip.isNew, restrictedOptions);
    blip.ring = sanitizeHtml(blip.ring, restrictedOptions);
    blip.quadrant = sanitizeHtml(blip.quadrant, restrictedOptions);

    return blip;
  };
  return self;
};

export default InputSanitizer;
