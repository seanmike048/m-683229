export interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  fieldPath: string;
  message: string;
  actualValue?: any;
  expectedValue?: string;
  specReference?: string;
}

export interface DetectedCharacteristics {
  primaryType: string;
  mediaFormats?: string[];
  platform?: string;
  deviceInfo?: string;
  privacySignals?: string[];
  isAdPod?: boolean;
  adPodDetails?: {
    slots: number;
    totalDuration: number;
  };
}

export interface BidRequestValidationResult {
  detectedCharacteristics: DetectedCharacteristics;
  issues: ValidationIssue[];
  isValid: boolean;
}

// Store URL patterns and validation data
const STORE_URL_PATTERNS = {
  ios: {
    patterns: [
      /^https:\/\/apps\.apple\.com\/.*\/app\/.*\/id(\d+)$/,
      /^https:\/\/apps\.apple\.com\/app\/id(\d+)$/,
      /^https:\/\/apps\.apple\.com\/us\/app\/id(\d+)$/
    ],
    bundlePattern: /^\d+$/,
    platform: 'iOS/tvOS'
  },
  android: {
    patterns: [
      /^https:\/\/play\.google\.com\/store\/apps\/details\?id=([a-zA-Z0-9._]+)$/
    ],
    bundlePattern: /^[a-zA-Z0-9._]+$/,
    platform: 'Android/AndroidTV'
  },
  roku: {
    patterns: [
      /^https:\/\/channelstore\.roku\.com\/details\/([a-zA-Z0-9]+)\/.*$/,
      /^https:\/\/channelstore\.roku\.com\/details\/(\d+)\/?$/
    ],
    bundlePattern: /^\d+$/,
    platform: 'Roku OS'
  },
  amazon: {
    patterns: [
      /^https:\/\/www\.amazon\.com\/.*\/dp\/([A-Z0-9]+)$/,
      /^https:\/\/www\.amazon\.com\/dp\/([A-Z0-9]+)$/
    ],
    bundlePattern: /^[A-Z0-9]+$/,
    platform: 'Fire OS'
  },
  microsoft: {
    patterns: [
      /^https:\/\/www\.microsoft\.com\/.*\/p\/.*\/([a-z0-9]+)$/,
      /^https:\/\/www\.microsoft\.com\/p\/.*\/([a-z0-9]+)$/
    ],
    bundlePattern: /^[a-z0-9]+$/,
    platform: 'Microsoft'
  },
  samsung: {
    patterns: [
      /^https:\/\/www\.samsung\.com\/us\/appstore\/app\/(G\d+)$/
    ],
    bundlePattern: /^G\d+$/,
    platform: 'Tizen'
  },
  lg: {
    patterns: [
      /^https:\/\/us\.lgappstv\.com\/main\/tvapp\/detail\?appId=(\d+)$/,
      /^https:\/\/fr\.lgappstv\.com\/main\/tvapp\/detail\?appId=(\d+)$/
    ],
    bundlePattern: /^\d+$/,
    platform: 'WebOS'
  },
  playstation: {
    patterns: [
      /^https:\/\/store\.playstation\.com\/en-us\/product\/([A-Z0-9_-]+)$/
    ],
    bundlePattern: /^[A-Z0-9_-]+$/,
    platform: 'Orbis OS'
  },
  vizio: {
    patterns: [
      /^https:\/\/www\.vizio\.com\/smart-tv-apps\?appName=([a-zA-Z0-9]+)&appId=(vizio\.[a-zA-Z0-9]+)$/
    ],
    bundlePattern: /^vizio\.[a-zA-Z0-9]+$/,
    platform: 'SmartCast'
  },
  philips: {
    patterns: [
      /^https:\/\/www\.zeasn\.tv\/whaleeco\/appstore\/detail\?appid=(\d+)$/
    ],
    bundlePattern: /^\d+$/,
    platform: 'AndroidTV'
  },
  huawei: {
    patterns: [
      /^https:\/\/appgallery\.huawei\.com\/#\/app\/(C\d+)$/
    ],
    bundlePattern: /^C\d+$/,
    platform: 'HarmonyOS'
  }
};

// Data center mappings
const DATA_CENTERS = [
  { id: 2, name: "Telecity", continent: null, technical: "", city: "" },
  { id: 3, name: "Equinix", technical: "eqx", continent: "Europe", city: "St Denis, Paris Area, FR" },
  { id: 4, name: "Interxion5", technical: "itx5", continent: "Europe", city: "Velizy, Paris Area, FR" },
  { id: 5, name: "Terremark", technical: "tmk", continent: "Americas", city: "Miami, Florida, US" },
  { id: 6, name: "Interxion4", technical: "itx4", continent: "Europe", city: "Velizy, Paris Area, FR" },
  { id: 7, name: "China", technical: "", continent: "Asia", city: "" },
  { id: 8, name: "Apac", technical: "sgp", continent: "Asia", city: "Singapore, SG" },
  { id: 10, name: "USW1", technical: "usw1", continent: "Americas", city: "Los Angeles, CA, US" },
  { id: 11, name: "EUW1", technical: "euw1", continent: "Europe", city: "Amsterdam, NL" },
  { id: 12, name: "USE1", technical: "use1", continent: "Americas", city: "Washington, US" },
  { id: 13, name: "APAC1", technical: "apac1", continent: "Asia", city: "Singapore, SG" },
  { id: 14, name: "EUW2", technical: "euw2", continent: "Europe", city: "Gravelines, hauts-de-france, FR" },
  { id: 15, name: "EUW3-DATA", technical: "euw3-data", continent: "Europe", city: "" },
  { id: 16, name: "USE2", technical: "use2", continent: "Americas", city: "Warrenton, VA, US" }
];

// Country to continent mapping
const COUNTRY_CONTINENT_MAP: { [key: string]: string } = {
  "ASM": "Oceania", "BHS": "Americas", "BHR": "Asia", "BEL": "Europe", "BMU": "Americas",
  "BOL": "Americas", "BRA": "Americas", "BRN": "Asia", "BGR": "Europe", "TCD": "Africa",
  "CHL": "Americas", "CHN": "Asia", "COL": "Americas", "COM": "Africa", "COK": "Oceania",
  "CZE": "Europe", "DJI": "Africa", "DMA": "Americas", "DOM": "Americas", "EGY": "Africa",
  "SLV": "Americas", "FJI": "Oceania", "GUF": "Americas", "DEU": "Europe", "GHA": "Africa",
  "GRC": "Europe", "GRD": "Americas", "GUM": "Oceania", "HTI": "Americas", "HND": "Americas",
  "IND": "Asia", "IDN": "Asia", "IRN": "Asia", "ISR": "Asia", "JPN": "Asia", "KWT": "Asia",
  "LSO": "Africa", "LIE": "Europe", "LTU": "Europe", "LUX": "Europe", "MWI": "Africa",
  "MDV": "Asia", "MHL": "Oceania", "MTQ": "Americas", "MRT": "Africa", "MEX": "Americas",
  "FSM": "Oceania", "MCO": "Europe", "MNG": "Asia", "MOZ": "Africa", "NRU": "Oceania",
  "NCL": "Oceania", "NGA": "Africa", "PAK": "Asia", "PER": "Americas", "PRT": "Europe",
  "PRI": "Americas", "QAT": "Asia", "REU": "Africa", "KNA": "Americas", "VCT": "Americas",
  "STP": "Africa", "SEN": "Africa", "SYC": "Africa", "SGP": "Asia", "SVN": "Europe",
  "ZAF": "Africa", "SDN": "Africa", "SWZ": "Africa", "CHE": "Europe", "TWN": "Asia",
  "TON": "Oceania", "TUR": "Asia", "UGA": "Africa", "GBR": "Europe", "UZB": "Asia",
  "VIR": "Americas", "ZMB": "Africa", "ZWE": "Africa", "AFG": "Asia", "ALB": "Europe",
  "AND": "Europe", "AGO": "Africa", "AIA": "Americas", "ARM": "Asia", "AUT": "Europe",
  "BTN": "Asia", "BFA": "Africa", "BDI": "Africa", "CAN": "Americas", "CPV": "Africa",
  "CAF": "Africa", "COD": "Africa", "CRI": "Americas", "CUB": "Americas", "CYP": "Asia",
  "DNK": "Europe", "ECU": "Americas", "ETH": "Africa", "FLK": "Americas", "FRO": "Europe",
  "FIN": "Europe", "GMB": "Africa", "GEO": "Asia", "GNB": "Africa", "GUY": "Americas",
  "ISL": "Europe", "JOR": "Asia", "KAZ": "Asia", "PRK": "Asia", "KOR": "Asia",
  "KGZ": "Asia", "LAO": "Asia", "LVA": "Europe", "LBN": "Asia", "LBY": "Africa",
  "MKD": "Europe", "MYS": "Asia", "MUS": "Africa", "MMR": "Asia", "NER": "Africa",
  "NIU": "Oceania", "OMN": "Asia", "PLW": "Oceania", "PNG": "Oceania", "PRY": "Americas",
  "PHL": "Asia", "RUS": "Asia", "RWA": "Africa", "LCA": "Americas", "SMR": "Europe",
  "SAU": "Asia", "SLE": "Africa", "SUR": "Americas", "SWE": "Europe", "TJK": "Asia",
  "TZA": "Africa", "TGO": "Africa", "TTO": "Americas", "TKM": "Asia", "TUV": "Oceania",
  "USA": "Americas", "VUT": "Oceania", "VEN": "Americas", "YEM": "Asia", "DZA": "Africa",
  "ATG": "Americas", "ARG": "Americas", "ABW": "Americas", "AUS": "Oceania", "AZE": "Asia",
  "BGD": "Asia", "BRB": "Americas", "BLR": "Europe", "BLZ": "Americas", "BEN": "Africa",
  "BIH": "Europe", "BWA": "Africa", "KHM": "Asia", "CMR": "Africa", "CYM": "Americas",
  "CXR": "Asia", "COG": "Africa", "GNQ": "Africa", "ERI": "Africa", "EST": "Europe",
  "FRA": "Europe", "PYF": "Oceania", "GAB": "Africa", "GIB": "Europe", "GRL": "Americas",
  "GLP": "Americas", "GTM": "Americas", "GIN": "Africa", "HUN": "Europe", "IRQ": "Asia",
  "IRL": "Europe", "ITA": "Europe", "JAM": "Americas", "KEN": "Africa", "KIR": "Oceania",
  "LBR": "Africa", "MDG": "Africa", "MLI": "Africa", "MLT": "Europe", "MYT": "Africa",
  "MDA": "Europe", "MSR": "Americas", "MAR": "Africa", "NAM": "Africa", "NPL": "Asia",
  "NLD": "Europe", "NIC": "Americas", "NFK": "Oceania", "MNP": "Oceania", "NOR": "Europe",
  "PAN": "Americas", "POL": "Europe", "ROU": "Europe", "WSM": "Oceania", "SVK": "Europe",
  "SLB": "Oceania", "SOM": "Africa", "ESP": "Europe", "LKA": "Asia", "SYR": "Asia",
  "THA": "Asia", "TUN": "Africa", "TCA": "Americas", "UKR": "Europe", "ARE": "Asia",
  "URY": "Americas", "VNM": "Asia", "VGB": "Americas", "WLF": "Oceania", "CIV": "Africa",
  "HRV": "Europe", "VAT": "Europe", "NZL": "Oceania", "SHN": "Africa", "SPM": "Americas",
  "SJM": "Europe", "TKL": "Oceania", "CCK": "Asia", "PCN": "Oceania", "ESH": "Africa"
};

export const validateBidRequest = async (jsonString: string): Promise<BidRequestValidationResult> => {
  const issues: ValidationIssue[] = [];
  let bidRequest: any;

  try {
    bidRequest = JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }

  // Detect characteristics
  const detectedCharacteristics = detectBidRequestCharacteristics(bidRequest);

  // Run all validation rules
  validateCoreBidRequest(bidRequest, issues);
  validateImpressions(bidRequest, issues);
  validateApp(bidRequest, issues);
  validateSite(bidRequest, issues);
  validateDevice(bidRequest, issues);
  validateUser(bidRequest, issues);
  validateRegs(bidRequest, issues);
  validateSource(bidRequest, issues);
  validateVideo(bidRequest, issues);
  validateNative(bidRequest, issues);
  validateBanner(bidRequest, issues);
  validateCTV(bidRequest, issues);
  validateDOOH(bidRequest, issues);
  validateAdvanced(bidRequest, issues);
  validateEquativRules(bidRequest, issues);

  const isValid = issues.filter(i => i.severity === 'error').length === 0;

  return {
    detectedCharacteristics,
    issues,
    isValid
  };
};

const detectBidRequestCharacteristics = (bidRequest: any): DetectedCharacteristics => {
  const characteristics: DetectedCharacteristics = {
    primaryType: 'Unknown'
  };

  // Detect primary type based on impressions
  if (bidRequest.imp && Array.isArray(bidRequest.imp)) {
    const types = [];
    const mediaFormats = [];

    for (const imp of bidRequest.imp) {
      if (imp.video) {
        types.push('Video');
        if (imp.video.mimes) {
          mediaFormats.push(...imp.video.mimes);
        }
      }
      if (imp.native) {
        types.push('Native');
      }
      if (imp.banner) {
        types.push('Display');
      }
      if (imp.audio) {
        types.push('Audio');
      }
    }

    characteristics.primaryType = types.length > 0 ? types.join(', ') : 'Unknown';
    characteristics.mediaFormats = [...new Set(mediaFormats)];
  }

  // Detect platform
  if (bidRequest.app) {
    characteristics.platform = 'Mobile App';
  } else if (bidRequest.site) {
    characteristics.platform = 'Website';
  }

  // Detect device info
  if (bidRequest.device) {
    const device = bidRequest.device;
    let deviceInfo = '';
    
    if (device.devicetype === 1) deviceInfo += 'Mobile/Tablet';
    else if (device.devicetype === 2) deviceInfo += 'Desktop';
    else if (device.devicetype === 5) deviceInfo += 'Connected TV';
    else if (device.devicetype === 6) deviceInfo += 'Digital Out-of-Home';
    else if (device.devicetype === 7) deviceInfo += 'Phone';

    if (device.os) {
      deviceInfo += ` (${device.os})`;
    }

    characteristics.deviceInfo = deviceInfo;
  }

  // Detect privacy signals
  const privacySignals = [];
  if (bidRequest.regs?.ext?.gdpr === 1) {
    privacySignals.push('GDPR Applicable');
  }
  if (bidRequest.user?.ext?.consent) {
    privacySignals.push('TCF String Present');
  }
  if (bidRequest.regs?.ext?.us_privacy) {
    privacySignals.push('CCPA String Present');
  }
  if (bidRequest.regs?.gpp) {
    privacySignals.push('GPP String Present');
  }
  characteristics.privacySignals = privacySignals;

  // Detect ad podding
  if (bidRequest.imp && bidRequest.imp.some((imp: any) => imp.video?.podid)) {
    characteristics.isAdPod = true;
    const podSlots = bidRequest.imp.filter((imp: any) => imp.video?.podid).length;
    const totalDuration = bidRequest.imp
      .filter((imp: any) => imp.video?.poddur)
      .reduce((sum: number, imp: any) => sum + (imp.video.poddur || 0), 0);
    
    characteristics.adPodDetails = {
      slots: podSlots,
      totalDuration
    };
  }

  return characteristics;
};

// Enhanced Core BidRequest validation with new rules
const validateCoreBidRequest = (bidRequest: any, issues: ValidationIssue[]) => {
  // Rule 1: BidRequest must have either app or site object
  const hasSite = !!bidRequest.site;
  const hasApp = !!bidRequest.app;

  if (!hasSite && !hasApp) {
    issues.push({
      id: 'EQ-BR-001',
      severity: 'error',
      fieldPath: 'BidRequest',
      message: 'BidRequest must contain either a site or an app object',
      expectedValue: 'Either site or app object'
    });
  }

  // Rule 2: BidRequest must have device object
  if (!bidRequest.device) {
    issues.push({
      id: 'EQ-BR-002',
      severity: 'error',
      fieldPath: 'BidRequest.device',
      message: 'BidRequest must contain a device object',
      expectedValue: 'Device object'
    });
  }

  // Rule 3: BidRequest must have impression object
  if (!bidRequest.imp || !Array.isArray(bidRequest.imp) || bidRequest.imp.length === 0) {
    issues.push({
      id: 'EQ-BR-003',
      severity: 'error',
      fieldPath: 'BidRequest.imp',
      message: 'BidRequest must contain a non-empty impression array',
      expectedValue: 'Non-empty array of impressions'
    });
  }

  // Rule 4: BidRequest must have source object
  if (!bidRequest.source) {
    issues.push({
      id: 'EQ-BR-004',
      severity: 'error',
      fieldPath: 'BidRequest.source',
      message: 'BidRequest must contain a source object',
      expectedValue: 'Source object'
    });
  }

  // Rule 5: BidRequest must have user object
  if (!bidRequest.user) {
    issues.push({
      id: 'EQ-BR-005',
      severity: 'error',
      fieldPath: 'BidRequest.user',
      message: 'BidRequest must contain a user object',
      expectedValue: 'User object'
    });
  }

  // Rule 6: Ensure partnerIsCalled=true (if present)
  if (bidRequest.ext?.partnerIsCalled !== undefined && bidRequest.ext.partnerIsCalled !== true) {
    issues.push({
      id: 'EQ-BR-006',
      severity: 'error',
      fieldPath: 'BidRequest.ext.partnerIsCalled',
      message: 'partnerIsCalled must be true when present',
      actualValue: bidRequest.ext.partnerIsCalled,
      expectedValue: 'true'
    });
  }

  // Rule 1: BidRequest must have id
  if (!bidRequest.id || typeof bidRequest.id !== 'string' || bidRequest.id.trim() === '') {
    issues.push({
      id: 'Core-BR-001',
      severity: 'error',
      fieldPath: 'BidRequest.id',
      message: 'BidRequest.id must be present and be a non-empty string',
      actualValue: bidRequest.id,
      expectedValue: 'Non-empty string'
    });
  }

  // Rule 2-3: BidRequest must have non-empty imp array
  if (!bidRequest.imp) {
    issues.push({
      id: 'Core-BR-002',
      severity: 'error',
      fieldPath: 'BidRequest.imp',
      message: 'BidRequest.imp array must be present',
      expectedValue: 'Array of impression objects'
    });
  } else if (!Array.isArray(bidRequest.imp) || bidRequest.imp.length === 0) {
    issues.push({
      id: 'Core-BR-003',
      severity: 'error',
      fieldPath: 'BidRequest.imp',
      message: 'BidRequest.imp must be a non-empty array',
      actualValue: bidRequest.imp,
      expectedValue: 'Non-empty array'
    });
  }

  // Rule 4: BidRequest must have at (auction type)
  if (bidRequest.at === undefined || typeof bidRequest.at !== 'number') {
    issues.push({
      id: 'Core-BR-004',
      severity: 'error',
      fieldPath: 'BidRequest.at',
      message: 'BidRequest.at (auction type) must be present and be an integer',
      actualValue: bidRequest.at,
      expectedValue: 'Integer (typically 1 or 2)'
    });
  }

  // Rule 5-6: Must have either site OR app, not both
  if (hasSite && hasApp) {
    issues.push({
      id: 'Core-BR-006',
      severity: 'error',
      fieldPath: 'BidRequest',
      message: 'BidRequest must not contain both site and app objects',
      actualValue: 'Both site and app present',
      expectedValue: 'Either site or app, not both'
    });
  }

  // Rule 7: Test flag validation
  if (bidRequest.test !== undefined && bidRequest.test !== 0 && bidRequest.test !== 1) {
    issues.push({
      id: 'Core-BR-007',
      severity: 'warning',
      fieldPath: 'BidRequest.test',
      message: 'test should be 0 (production) or 1 (test)',
      actualValue: bidRequest.test,
      expectedValue: '0 or 1'
    });
  }

  // Rule 9: Timeout validation
  if (!bidRequest.tmax || bidRequest.tmax <= 0) {
    issues.push({
      id: 'Core-BR-009',
      severity: 'warning',
      fieldPath: 'BidRequest.tmax',
      message: 'tmax (timeout) should be present and greater than 0',
      actualValue: bidRequest.tmax,
      expectedValue: 'Positive integer (milliseconds)'
    });
  }
};

// Enhanced App validation with store URL patterns
const validateApp = (bidRequest: any, issues: ValidationIssue[]) => {
  if (!bidRequest.app) return;

  const app = bidRequest.app;

  // Rule 7: app.storeurl must be defined
  if (!app.storeurl || typeof app.storeurl !== 'string') {
    issues.push({
      id: 'EQ-App-007',
      severity: 'error',
      fieldPath: 'BidRequest.app.storeurl',
      message: 'app.storeurl must be present and be a string',
      actualValue: app.storeurl,
      expectedValue: 'Valid store URL string'
    });
    return; // Can't validate further without storeurl
  }

  // Rule 8: app.bundle must be defined
  if (!app.bundle || typeof app.bundle !== 'string') {
    issues.push({
      id: 'EQ-App-008',
      severity: 'error',
      fieldPath: 'BidRequest.app.bundle',
      message: 'app.bundle must be present and be a string',
      actualValue: app.bundle,
      expectedValue: 'Bundle identifier string'
    });
    return; // Can't validate further without bundle
  }

  // Validate store URL and bundle patterns
  validateStoreUrlAndBundle(app.storeurl, app.bundle, issues);

  // Rule 17: app.bundle should not contain macros
  if (containsMacros(app.bundle)) {
    issues.push({
      id: 'EQ-App-017',
      severity: 'error',
      fieldPath: 'BidRequest.app.bundle',
      message: 'app.bundle must not contain un-replaced macros',
      actualValue: app.bundle,
      expectedValue: 'Bundle without macros'
    });
  }

  // Rule 18: app.storeurl should not contain macros
  if (containsMacros(app.storeurl)) {
    issues.push({
      id: 'EQ-App-018',
      severity: 'error',
      fieldPath: 'BidRequest.app.storeurl',
      message: 'app.storeurl must not contain un-replaced macros',
      actualValue: app.storeurl,
      expectedValue: 'Store URL without macros'
    });
  }

  // Rule 19: app object should not contain macros
  const appJson = JSON.stringify(app);
  if (containsMacros(appJson)) {
    issues.push({
      id: 'EQ-App-019',
      severity: 'error',
      fieldPath: 'BidRequest.app',
      message: 'app object must not contain potential macros',
      expectedValue: 'App object without macros'
    });
  }

  // Rule 20: app.id is recommended
  if (!app.id) {
    issues.push({
      id: 'EQ-App-020',
      severity: 'warning',
      fieldPath: 'BidRequest.app.id',
      message: 'app.id is recommended for better identification',
      expectedValue: 'App identifier string'
    });
  }

  // Rule 22-23: Bundle validation
  if (!app.bundle || typeof app.bundle !== 'string') {
    issues.push({
      id: 'Core-App-001',
      severity: 'error',
      fieldPath: 'BidRequest.app.bundle',
      message: 'app.bundle must be present and be a string',
      actualValue: app.bundle,
      expectedValue: 'String (e.g., "com.example.app")'
    });
  }

  // Rule 24-26: Store URL validation
  if (!app.storeurl || typeof app.storeurl !== 'string') {
    issues.push({
      id: 'Core-App-002',
      severity: 'error',
      fieldPath: 'BidRequest.app.storeurl',
      message: 'app.storeurl must be present and be a string',
      actualValue: app.storeurl,
      expectedValue: 'Valid URL string'
    });
  } else {
    try {
      new URL(app.storeurl);
    } catch {
      issues.push({
        id: 'Core-App-003',
        severity: 'error',
        fieldPath: 'BidRequest.app.storeurl',
        message: 'app.storeurl must be a valid URL',
        actualValue: app.storeurl,
        expectedValue: 'Valid URL'
      });
    }

    // Check for un-replaced macros
    if (app.storeurl.includes('{') || app.storeurl.includes('[')) {
      issues.push({
        id: 'Core-App-004',
        severity: 'error',
        fieldPath: 'BidRequest.app.storeurl',
        message: 'app.storeurl contains un-replaced macros',
        actualValue: app.storeurl,
        expectedValue: 'URL without macros'
      });
    }
  }

  // Rule 27-28: Publisher validation
  if (!app.publisher) {
    issues.push({
      id: 'Core-App-005',
      severity: 'error',
      fieldPath: 'BidRequest.app.publisher',
      message: 'app.publisher object must be present',
      expectedValue: 'Publisher object with id'
    });
  } else if (!app.publisher.id || typeof app.publisher.id !== 'string') {
    issues.push({
      id: 'Core-App-006',
      severity: 'error',
      fieldPath: 'BidRequest.app.publisher.id',
      message: 'app.publisher.id must be present and be a string',
      actualValue: app.publisher.id,
      expectedValue: 'Non-empty string'
    });
  }
};

// Enhanced Device validation
const validateDevice = (bidRequest: any, issues: ValidationIssue[]) => {
  if (!bidRequest.device) return;

  const device = bidRequest.device;

  // Rule 22: device.geo must be defined
  if (!device.geo) {
    issues.push({
      id: 'EQ-Device-022',
      severity: 'error',
      fieldPath: 'BidRequest.device.geo',
      message: 'device.geo object must be present',
      expectedValue: 'Geo object'
    });
  } else {
    // Rule 23: device.geo.country must be defined
    if (!device.geo.country) {
      issues.push({
        id: 'EQ-Device-023',
        severity: 'error',
        fieldPath: 'BidRequest.device.geo.country',
        message: 'device.geo.country must be present',
        expectedValue: 'ISO 3166-1 Alpha-3 country code'
      });
    } else {
      // Rule 24: Validate country matches datacenter continent
      validateCountryDatacenterMatch(device.geo.country, bidRequest.ext?.auctionDatacenterId, issues);
    }
  }

  // Rule 25: device.make must be defined
  if (!device.make) {
    issues.push({
      id: 'EQ-Device-025',
      severity: 'error',
      fieldPath: 'BidRequest.device.make',
      message: 'device.make must be present',
      expectedValue: 'Device manufacturer string'
    });
  }

  // Rule 26: device.model must be defined
  if (!device.model) {
    issues.push({
      id: 'EQ-Device-026',
      severity: 'error',
      fieldPath: 'BidRequest.device.model',
      message: 'device.model must be present',
      expectedValue: 'Device model string'
    });
  }

  // Rule 27: device.ifa must be defined
  if (!device.ifa) {
    issues.push({
      id: 'EQ-Device-027',
      severity: 'error',
      fieldPath: 'BidRequest.device.ifa',
      message: 'device.ifa (ID for Advertising) must be present',
      expectedValue: 'Valid advertising identifier'
    });
  } else {
    // Rule 32: Check if ifa is all zeros
    if (device.ifa === '00000000-0000-0000-0000-000000000000' && device.ext?.truncated_ip !== 1) {
      issues.push({
        id: 'EQ-Device-032',
        severity: 'error',
        fieldPath: 'BidRequest.device.ext.truncated_ip',
        message: 'truncated_ip flag must be set to 1 when device.ifa is all zeros',
        actualValue: device.ext?.truncated_ip,
        expectedValue: '1'
      });
    }
  }

  // Rule 28: device.ip or device.ipv6 must be set
  if (!device.ip && !device.ipv6) {
    issues.push({
      id: 'EQ-Device-028',
      severity: 'error',
      fieldPath: 'BidRequest.device',
      message: 'device must contain either ip (IPv4) or ipv6',
      expectedValue: 'Valid IP address'
    });
  }

  // Rule 29: Validate IP address format
  if (device.ip && !isValidIPv4(device.ip)) {
    issues.push({
      id: 'EQ-Device-029',
      severity: 'error',
      fieldPath: 'BidRequest.device.ip',
      message: 'device.ip must be a valid IPv4 address',
      actualValue: device.ip,
      expectedValue: 'Valid IPv4 address'
    });
  }

  // Rules 30-31: Check truncated IP flags
  if (device.ip && isTruncatedIP(device.ip) && device.ext?.truncated_ip !== 1) {
    issues.push({
      id: 'EQ-Device-030',
      severity: 'error',
      fieldPath: 'BidRequest.device.ext.truncated_ip',
      message: 'truncated_ip flag must be set to 1 when device.ip is truncated',
      actualValue: device.ext?.truncated_ip,
      expectedValue: '1'
    });
  }

  if (device.ipv6 && isTruncatedIPv6(device.ipv6) && device.ext?.truncated_ip !== 1) {
    issues.push({
      id: 'EQ-Device-031',
      severity: 'error',
      fieldPath: 'BidRequest.device.ext.truncated_ip',
      message: 'truncated_ip flag must be set to 1 when device.ipv6 is truncated',
      actualValue: device.ext?.truncated_ip,
      expectedValue: '1'
    });
  }

  // Rule 33: device.devicetype must be defined
  if (device.devicetype === undefined) {
    issues.push({
      id: 'EQ-Device-033',
      severity: 'error',
      fieldPath: 'BidRequest.device.devicetype',
      message: 'device.devicetype must be present',
      expectedValue: 'Integer 1-7'
    });
  }

  // Rule 34: device.ua must be defined
  if (!device.ua) {
    issues.push({
      id: 'EQ-Device-034',
      severity: 'error',
      fieldPath: 'BidRequest.device.ua',
      message: 'device.ua (User Agent) must be present',
      expectedValue: 'User Agent string'
    });
  }

  // Rule 35: device.ext.is_app=1 only if app object exists
  if (device.ext?.is_app === 1 && !bidRequest.app) {
    issues.push({
      id: 'EQ-Device-035',
      severity: 'error',
      fieldPath: 'BidRequest.device.ext.is_app',
      message: 'device.ext.is_app=1 but no app object present',
      expectedValue: 'App object when is_app=1'
    });
  }

  // Rule 35: User Agent validation
  if (!device.ua || typeof device.ua !== 'string') {
    issues.push({
      id: 'Core-Device-001',
      severity: 'error',
      fieldPath: 'BidRequest.device.ua',
      message: 'device.ua (User Agent) must be present and be a string',
      actualValue: device.ua,
      expectedValue: 'User Agent string'
    });
  }

  // Rule 36-38: IP address validation
  const hasIP = !!device.ip;
  const hasIPv6 = !!device.ipv6;

  if (!hasIP && !hasIPv6) {
    issues.push({
      id: 'Core-Device-002',
      severity: 'error',
      fieldPath: 'BidRequest.device',
      message: 'device must contain either ip (IPv4) or ipv6',
      expectedValue: 'Valid IP address'
    });
  }

  if (hasIP && !isValidIPv4(device.ip)) {
    issues.push({
      id: 'Core-Device-003',
      severity: 'error',
      fieldPath: 'BidRequest.device.ip',
      message: 'device.ip must be a valid IPv4 address',
      actualValue: device.ip,
      expectedValue: 'Valid IPv4 address'
    });
  }

  if (hasIPv6 && !isValidIPv6(device.ipv6)) {
    issues.push({
      id: 'Core-Device-004',
      severity: 'error',
      fieldPath: 'BidRequest.device.ipv6',
      message: 'device.ipv6 must be a valid IPv6 address',
      actualValue: device.ipv6,
      expectedValue: 'Valid IPv6 address'
    });
  }

  // Rule 40: Device type validation
  if (device.devicetype === undefined || !Number.isInteger(device.devicetype) || device.devicetype < 1 || device.devicetype > 7) {
    issues.push({
      id: 'Core-Device-005',
      severity: 'error',
      fieldPath: 'BidRequest.device.devicetype',
      message: 'device.devicetype must be an integer between 1-7',
      actualValue: device.devicetype,
      expectedValue: 'Integer 1-7'
    });
  }

  // Rule 41-43: Geo validation
  if (!device.geo) {
    issues.push({
      id: 'Core-Device-006',
      severity: 'error',
      fieldPath: 'BidRequest.device.geo',
      message: 'device.geo object must be present',
      expectedValue: 'Geo object with country'
    });
  } else {
    if (!device.geo.country || typeof device.geo.country !== 'string') {
      issues.push({
        id: 'Core-Device-007',
        severity: 'error',
        fieldPath: 'BidRequest.device.geo.country',
        message: 'device.geo.country must be present and be a string',
        actualValue: device.geo.country,
        expectedValue: 'ISO 3166-1 Alpha-3 country code'
      });
    } else if (device.geo.country.length !== 3) {
      issues.push({
        id: 'Core-Device-008',
        severity: 'error',
        fieldPath: 'BidRequest.device.geo.country',
        message: 'device.geo.country must be a valid ISO 3166-1 Alpha-3 code',
        actualValue: device.geo.country,
        expectedValue: '3-letter country code (e.g., "USA")'
      });
    }
  }

  // Rule 44-45: IFA validation
  if (device.lmt !== 1 && (!device.ifa || device.ifa === '00000000-0000-0000-0000-000000000000')) {
    issues.push({
      id: 'Core-Device-009',
      severity: 'warning',
      fieldPath: 'BidRequest.device.ifa',
      message: 'device.ifa (ID for Advertising) should be present unless lmt=1',
      actualValue: device.ifa,
      expectedValue: 'Valid advertising ID'
    });
  }
};

// Enhanced impression validation
const validateImpressions = (bidRequest: any, issues: ValidationIssue[]) => {
  if (!bidRequest.imp || !Array.isArray(bidRequest.imp)) return;

  const impIds = new Set();

  bidRequest.imp.forEach((imp: any, index: number) => {
    const basePath = `BidRequest.imp[${index}]`;

    // Rule 36: imp.secure must be 0 or 1
    if (imp.secure !== undefined && imp.secure !== 0 && imp.secure !== 1) {
      issues.push({
        id: 'EQ-Imp-036',
        severity: 'error',
        fieldPath: `${basePath}.secure`,
        message: 'imp.secure must be either 0 or 1',
        actualValue: imp.secure,
        expectedValue: '0 or 1'
      });
    }

    // Video-specific validations
    if (imp.video) {
      validateVideoImpressionRules(imp.video, index, issues);
    }

    // Rule 48: imp.ext.wopv is defined (for video impressions)
    if (imp.video && !imp.ext?.wopv) {
      issues.push({
        id: 'EQ-Imp-048',
        severity: 'warning',
        fieldPath: `${basePath}.ext.wopv`,
        message: 'imp.ext.wopv is recommended for video impressions',
        expectedValue: 'WOPV (Won on Programmatic Video) flag'
      });
    }

    // Rule 12: Each imp must have unique id
    if (!imp.id || typeof imp.id !== 'string') {
      issues.push({
        id: 'Core-Imp-001',
        severity: 'error',
        fieldPath: `${basePath}.id`,
        message: 'Each impression must contain a unique id (string)',
        actualValue: imp.id,
        expectedValue: 'Non-empty string'
      });
    } else if (impIds.has(imp.id)) {
      issues.push({
        id: 'Core-Imp-001b',
        severity: 'error',
        fieldPath: `${basePath}.id`,
        message: 'Impression id must be unique within the request',
        actualValue: imp.id,
        expectedValue: 'Unique string'
      });
    } else {
      impIds.add(imp.id);
    }

    // Rule 13-14: Must have exactly one of video, native, or banner
    const hasVideo = !!imp.video;
    const hasNative = !!imp.native;
    const hasBanner = !!imp.banner;
    const mediaCount = [hasVideo, hasNative, hasBanner].filter(Boolean).length;

    if (mediaCount === 0) {
      issues.push({
        id: 'Core-Imp-002',
        severity: 'error',
        fieldPath: basePath,
        message: 'Each impression must contain either video, native, or banner object',
        expectedValue: 'One of: video, native, or banner'
      });
    } else if (mediaCount > 1) {
      issues.push({
        id: 'Core-Imp-003',
        severity: 'error',
        fieldPath: basePath,
        message: 'Each impression must contain only one of video, native, or banner',
        actualValue: `Multiple media types present`,
        expectedValue: 'Only one of: video, native, or banner'
      });
    }

    // Rule 15-16: Bid floor validation
    if (imp.bidfloor !== undefined) {
      if (typeof imp.bidfloor !== 'number' || imp.bidfloor < 0) {
        issues.push({
          id: 'Core-Imp-004',
          severity: 'warning',
          fieldPath: `${basePath}.bidfloor`,
          message: 'bidfloor must be a non-negative number',
          actualValue: imp.bidfloor,
          expectedValue: 'Non-negative number'
        });
      }

      if (!imp.bidfloorcur) {
        issues.push({
          id: 'Core-Imp-005',
          severity: 'error',
          fieldPath: `${basePath}.bidfloorcur`,
          message: 'bidfloorcur must be present when bidfloor is specified',
          expectedValue: 'Currency code (e.g., "USD")'
        });
      }
    }

    // Rule 17: Secure flag validation
    if (imp.secure !== undefined && imp.secure !== 0 && imp.secure !== 1) {
      issues.push({
        id: 'Core-Imp-006',
        severity: 'error',
        fieldPath: `${basePath}.secure`,
        message: 'secure must be 0 or 1',
        actualValue: imp.secure,
        expectedValue: '0 or 1'
      });
    }
  });
};

// Enhanced video validation with new rules
const validateVideoImpressionRules = (video: any, impIndex: number, issues: ValidationIssue[]) => {
  const basePath = `BidRequest.imp[${impIndex}].video`;

  // Rule 37: Duration difference validation
  if (video.minduration && video.maxduration) {
    const durationDiff = video.maxduration - video.minduration;
    if (durationDiff < 30) {
      issues.push({
        id: 'EQ-Video-037',
        severity: 'error',
        fieldPath: basePath,
        message: 'imp.video.maxduration - imp.video.minduration must be greater than 30 seconds',
        actualValue: `${durationDiff} seconds`,
        expectedValue: 'Greater than 30 seconds'
      });
    }
  }

  // Rule 38: imp.video.playbackmethod must be defined
  if (!video.playbackmethod) {
    issues.push({
      id: 'EQ-Video-038',
      severity: 'error',
      fieldPath: `${basePath}.playbackmethod`,
      message: 'imp.video.playbackmethod must be defined',
      expectedValue: 'Array of playback method integers'
    });
  }

  // Rule 39: imp.video.placement must be defined
  if (video.placement === undefined) {
    issues.push({
      id: 'EQ-Video-039',
      severity: 'error',
      fieldPath: `${basePath}.placement`,
      message: 'imp.video.placement must be defined',
      expectedValue: 'Integer placement type'
    });
  }

  // Rule 40: Autoplay validation for in-stream
  if (video.placement === 1 && video.playbackmethod && !video.playbackmethod.includes(1)) {
    issues.push({
      id: 'EQ-Video-040',
      severity: 'error',
      fieldPath: `${basePath}.playbackmethod`,
      message: 'imp.video.playbackmethod must include 1 (Autoplay Sounds On) for In-Stream placement',
      actualValue: video.playbackmethod,
      expectedValue: 'Array including 1'
    });
  }

  // Rule 41: imp.video.linearity must be defined
  if (video.linearity === undefined) {
    issues.push({
      id: 'EQ-Video-041',
      severity: 'error',
      fieldPath: `${basePath}.linearity`,
      message: 'imp.video.linearity must be defined',
      expectedValue: 'Integer linearity type'
    });
  }

  // Rule 42: imp.video.pos must be set
  if (video.pos === undefined) {
    issues.push({
      id: 'EQ-Video-042',
      severity: 'error',
      fieldPath: `${basePath}.pos`,
      message: 'imp.video.pos (position) must be set',
      expectedValue: 'Integer position value'
    });
  }

  // Rule 43: imp.video.protocols must be defined
  if (!video.protocols) {
    issues.push({
      id: 'EQ-Video-043',
      severity: 'error',
      fieldPath: `${basePath}.protocols`,
      message: 'imp.video.protocols must be defined',
      expectedValue: 'Array of protocol integers'
    });
  }

  // Rule 44: imp.video.mimes must be defined as array
  if (!video.mimes || !Array.isArray(video.mimes)) {
    issues.push({
      id: 'EQ-Video-044',
      severity: 'error',
      fieldPath: `${basePath}.mimes`,
      message: 'imp.video.mimes must be defined as an array',
      actualValue: video.mimes,
      expectedValue: 'Array of MIME type strings'
    });
  } else {
    // Rule 45: video/mp4 mime check
    if (!video.mimes.includes('video/mp4')) {
      issues.push({
        id: 'EQ-Video-045',
        severity: 'warning',
        fieldPath: `${basePath}.mimes`,
        message: 'video/mp4 mime is not set. Usually video bid requests contain video/mp4 mimes',
        actualValue: video.mimes,
        expectedValue: 'Array including "video/mp4"'
      });
    }
  }

  // Rule 46: imp.video.w must be defined
  if (!video.w) {
    issues.push({
      id: 'EQ-Video-046',
      severity: 'error',
      fieldPath: `${basePath}.w`,
      message: 'imp.video.w (width) must be defined',
      expectedValue: 'Integer width'
    });
  }

  // Rule 47: imp.video.h must be defined
  if (!video.h) {
    issues.push({
      id: 'EQ-Video-047',
      severity: 'error',
      fieldPath: `${basePath}.h`,
      message: 'imp.video.h (height) must be defined',
      expectedValue: 'Integer height'
    });
  }

  // Rule 49: imp.video.startdelay is recommended
  if (video.startdelay === undefined) {
    issues.push({
      id: 'EQ-Video-049',
      severity: 'warning',
      fieldPath: `${basePath}.startdelay`,
      message: 'imp.video.startdelay is recommended',
      expectedValue: 'Integer start delay'
    });
  } else {
    // Rule 50: startdelay must be integer
    if (!Number.isInteger(video.startdelay)) {
      issues.push({
        id: 'EQ-Video-050',
        severity: 'error',
        fieldPath: `${basePath}.startdelay`,
        message: 'imp.video.startdelay must be an integer (positive, negative or zero)',
        actualValue: video.startdelay,
        expectedValue: 'Integer value'
      });
    }
  }
};

// Enhanced CTV validation
const validateCTV = (bidRequest: any, issues: ValidationIssue[]) => {
  if (!bidRequest.device || bidRequest.device.devicetype !== 5) return;

  // Rule 54: app object must be defined for CTV
  if (!bidRequest.app) {
    issues.push({
      id: 'EQ-CTV-054',
      severity: 'error',
      fieldPath: 'BidRequest.app',
      message: 'app object must be defined for CTV requests',
      expectedValue: 'App object for CTV application'
    });
  }

  // CTV video validations
  if (bidRequest.imp) {
    bidRequest.imp.forEach((imp: any, index: number) => {
      if (!imp.video) return;

      const video = imp.video;
      const basePath = `BidRequest.imp[${index}].video`;

      // Rule 51: CTV imp.video.pos must be defined
      if (video.pos === undefined) {
        issues.push({
          id: 'EQ-CTV-051',
          severity: 'error',
          fieldPath: `${basePath}.pos`,
          message: 'CTV: imp.video.pos must be defined',
          expectedValue: 'Integer position value'
        });
      } else {
        // Rule 52: CTV pos must be 7 (Full Screen)
        if (video.pos !== 7) {
          issues.push({
            id: 'EQ-CTV-052',
            severity: 'error',
            fieldPath: `${basePath}.pos`,
            message: 'CTV: imp.video.pos must be set to 7 (Full Screen)',
            actualValue: video.pos,
            expectedValue: '7'
          });
        }
      }

      // Rule 53: CTV aspect ratio check
      if (video.w && video.h) {
        const aspectRatio = video.w / video.h;
        const expectedRatio = 16 / 9;
        const tolerance = 0.1;
        
        if (Math.abs(aspectRatio - expectedRatio) > tolerance) {
          issues.push({
            id: 'EQ-CTV-053',
            severity: 'error',
            fieldPath: basePath,
            message: 'CTV: imp.video.h and imp.video.w should match a 16:9 aspect ratio',
            actualValue: `${video.w}x${video.h} (${aspectRatio.toFixed(2)}:1)`,
            expectedValue: '16:9 aspect ratio'
          });
        }
      }
    });
  }

  // Rule 89: Video must be present for CTV
  if (!bidRequest.imp || !bidRequest.imp.some((imp: any) => imp.video)) {
    issues.push({
      id: 'CTV-001',
      severity: 'error',
      fieldPath: 'BidRequest.imp',
      message: 'CTV requests must contain video impressions',
      expectedValue: 'At least one impression with video object'
    });
  }

  // Rule 90: App object must be present for CTV
  if (!bidRequest.app) {
    issues.push({
      id: 'CTV-002',
      severity: 'error',
      fieldPath: 'BidRequest.app',
      message: 'CTV requests must contain app object',
      expectedValue: 'App object for CTV application'
    });
  }

  // Rule 91: Device IFA validation for CTV
  const device = bidRequest.device;
  if (!device.ifa && !device.ext?.ids?.idfa && !device.ext?.ids?.rida) {
    issues.push({
      id: 'CTV-003',
      severity: 'error',
      fieldPath: 'BidRequest.device',
      message: 'CTV requests must contain device.ifa or equivalent ID',
      expectedValue: 'Valid device identifier'
    });
  }

  // Rule 92: Make and model validation for CTV
  if (!device.make || !device.model) {
    issues.push({
      id: 'CTV-004',
      severity: 'error',
      fieldPath: 'BidRequest.device',
      message: 'CTV requests must contain device.make and device.model',
      actualValue: `make: ${device.make}, model: ${device.model}`,
      expectedValue: 'Both make and model strings'
    });
  }

  // Additional CTV-specific video validations
  if (bidRequest.imp) {
    bidRequest.imp.forEach((imp: any, index: number) => {
      if (!imp.video) return;

      const video = imp.video;
      const basePath = `BidRequest.imp[${index}].video`;

      // Rule 93-95: CTV video requirements
      if (video.placement !== 1) {
        issues.push({
          id: 'CTV-005',
          severity: 'error',
          fieldPath: `${basePath}.placement`,
          message: 'CTV video placement must be 1 (In-Stream)',
          actualValue: video.placement,
          expectedValue: '1'
        });
      }

      if (video.linearity !== 1) {
        issues.push({
          id: 'CTV-006',
          severity: 'error',
          fieldPath: `${basePath}.linearity`,
          message: 'CTV video linearity must be 1 (Linear)',
          actualValue: video.linearity,
          expectedValue: '1'
        });
      }

      if (video.pos !== 7) {
        issues.push({
          id: 'CTV-007',
          severity: 'error',
          fieldPath: `${basePath}.pos`,
          message: 'CTV video pos must be 7 (Full Screen)',
          actualValue: video.pos,
          expectedValue: '7'
        });
      }
    });
  }
};

// Helper functions for validation
const validateStoreUrlAndBundle = (storeUrl: string, bundle: string, issues: ValidationIssue[]) => {
  let foundMatch = false;

  // Check each store pattern
  for (const [platform, config] of Object.entries(STORE_URL_PATTERNS)) {
    for (const pattern of config.patterns) {
      const match = storeUrl.match(pattern);
      if (match) {
        foundMatch = true;
        const extractedBundle = match[1];
        
        // Validate bundle format for this platform
        if (!config.bundlePattern.test(bundle)) {
          issues.push({
            id: `EQ-App-${platform.toUpperCase()}-010`,
            severity: 'error',
            fieldPath: 'BidRequest.app.bundle',
            message: `${platform}: bundle must match store-specific pattern`,
            actualValue: bundle,
            expectedValue: `Pattern: ${config.bundlePattern.source}`
          });
        }
        
        // Check if bundle matches extracted value from URL
        if (extractedBundle !== bundle) {
          issues.push({
            id: `EQ-App-${platform.toUpperCase()}-015`,
            severity: 'error',
            fieldPath: 'BidRequest.app',
            message: `Bundle ID mismatch: bundle (${bundle}) doesn't match store URL (${extractedBundle})`,
            actualValue: bundle,
            expectedValue: extractedBundle
          });
        }
        
        return; // Found match, stop checking
      }
    }
  }

  if (!foundMatch) {
    issues.push({
      id: 'EQ-App-016',
      severity: 'error',
      fieldPath: 'BidRequest.app.storeurl',
      message: 'Store URL does not match any known platform patterns',
      actualValue: storeUrl,
      expectedValue: 'Valid store URL for supported platforms'
    });
  }
};

const validateCountryDatacenterMatch = (country: string, datacenterId: number | undefined, issues: ValidationIssue[]) => {
  if (!datacenterId || !COUNTRY_CONTINENT_MAP[country]) return;

  const datacenter = DATA_CENTERS.find(dc => dc.id === datacenterId);
  if (!datacenter || !datacenter.continent) return;

  const countryContinent = COUNTRY_CONTINENT_MAP[country];
  
  if (datacenter.continent !== countryContinent) {
    issues.push({
      id: 'EQ-Device-024',
      severity: 'warning',
      fieldPath: 'BidRequest.device.geo.country',
      message: 'Country continent mismatch with datacenter continent',
      actualValue: `${country} (${countryContinent}) vs Datacenter: ${datacenter.name} (${datacenter.continent})`,
      expectedValue: 'Country continent should match datacenter continent'
    });
  }
};

const containsMacros = (text: string): boolean => {
  const macroPattern = /\[[\w_]+\]|\{[\w_]+\}/g;
  return macroPattern.test(text);
};

const isTruncatedIP = (ip: string): boolean => {
  // Check for common truncation patterns like ending with .0
  return ip.endsWith('.0') || ip.includes('xxx') || ip.includes('***');
};

const isTruncatedIPv6 = (ipv6: string): boolean => {
  // Check for IPv6 truncation patterns
  return ipv6.includes('::') && ipv6.length < 15;
};

// Add new Equativ-specific validation function
const validateEquativRules = (bidRequest: any, issues: ValidationIssue[]) => {
  // Rule 21: source.schain must be defined
  if (!bidRequest.source?.schain && !bidRequest.source?.ext?.schain) {
    issues.push({
      id: 'EQ-Source-021',
      severity: 'error',
      fieldPath: 'BidRequest.source.schain',
      message: 'source.schain must be defined',
      expectedValue: 'Supply chain object'
    });
  }

  // Additional Equativ-specific validations can be added here
};

// Video validation
const validateVideo = (bidRequest: any, issues: ValidationIssue[]) => {
  if (!bidRequest.imp) return;

  bidRequest.imp.forEach((imp: any, index: number) => {
    if (!imp.video) return;

    const video = imp.video;
    const basePath = `BidRequest.imp[${index}].video`;

    // Rule 58-59: MIME types validation
    if (!video.mimes || !Array.isArray(video.mimes) || video.mimes.length === 0) {
      issues.push({
        id: 'Video-V-001',
        severity: 'error',
        fieldPath: `${basePath}.mimes`,
        message: 'video.mimes must be present and be a non-empty array of strings',
        actualValue: video.mimes,
        expectedValue: 'Array of MIME types (e.g., ["video/mp4"])'
      });
    } else if (!video.mimes.every((mime: any) => typeof mime === 'string')) {
      issues.push({
        id: 'Video-V-002',
        severity: 'error',
        fieldPath: `${basePath}.mimes`,
        message: 'video.mimes must contain only strings',
        actualValue: video.mimes,
        expectedValue: 'Array of string MIME types'
      });
    } else if (!video.mimes.includes('video/mp4')) {
      issues.push({
        id: 'Video-V-003',
        severity: 'warning',
        fieldPath: `${basePath}.mimes`,
        message: 'video.mimes should typically include "video/mp4"',
        actualValue: video.mimes,
        expectedValue: 'Array including "video/mp4"'
      });
    }

    // Rule 60-62: Duration validation
    if (video.minduration === undefined || !Number.isInteger(video.minduration)) {
      issues.push({
        id: 'Video-V-004',
        severity: 'error',
        fieldPath: `${basePath}.minduration`,
        message: 'video.minduration must be present and be an integer',
        actualValue: video.minduration,
        expectedValue: 'Integer (seconds)'
      });
    }

    if (video.maxduration === undefined || !Number.isInteger(video.maxduration)) {
      issues.push({
        id: 'Video-V-005',
        severity: 'error',
        fieldPath: `${basePath}.maxduration`,
        message: 'video.maxduration must be present and be an integer',
        actualValue: video.maxduration,
        expectedValue: 'Integer (seconds)'
      });
    }

    if (video.minduration && video.maxduration && video.maxduration < video.minduration) {
      issues.push({
        id: 'Video-V-006',
        severity: 'error',
        fieldPath: `${basePath}`,
        message: 'video.maxduration must be greater than or equal to minduration',
        actualValue: `min: ${video.minduration}, max: ${video.maxduration}`,
        expectedValue: 'maxduration >= minduration'
      });
    }

    // Rule 63: Protocols validation
    if (!video.protocols || !Array.isArray(video.protocols) || video.protocols.length === 0) {
      issues.push({
        id: 'Video-V-007',
        severity: 'error',
        fieldPath: `${basePath}.protocols`,
        message: 'video.protocols must be present and be a non-empty array of integers',
        actualValue: video.protocols,
        expectedValue: 'Array of protocol integers'
      });
    }

    // Rule 64: Width and height validation
    if (video.w === undefined || !Number.isInteger(video.w) || video.w <= 0) {
      issues.push({
        id: 'Video-V-008',
        severity: 'error',
        fieldPath: `${basePath}.w`,
        message: 'video.w (width) must be present and be a positive integer',
        actualValue: video.w,
        expectedValue: 'Positive integer'
      });
    }

    if (video.h === undefined || !Number.isInteger(video.h) || video.h <= 0) {
      issues.push({
        id: 'Video-V-009',
        severity: 'error',
        fieldPath: `${basePath}.h`,
        message: 'video.h (height) must be present and be a positive integer',
        actualValue: video.h,
        expectedValue: 'Positive integer'
      });
    }

    // Rule 65-66: Linearity and placement validation
    if (video.linearity === undefined || !Number.isInteger(video.linearity)) {
      issues.push({
        id: 'Video-V-010',
        severity: 'error',
        fieldPath: `${basePath}.linearity`,
        message: 'video.linearity must be present and be an integer',
        actualValue: video.linearity,
        expectedValue: 'Integer (1=linear, 2=non-linear)'
      });
    }

    if (video.placement === undefined || !Number.isInteger(video.placement)) {
      issues.push({
        id: 'Video-V-011',
        severity: 'error',
        fieldPath: `${basePath}.placement`,
        message: 'video.placement must be present and be an integer',
        actualValue: video.placement,
        expectedValue: 'Integer placement type'
      });
    }

    // Rule 68: Start delay validation
    if (video.startdelay === undefined || !Number.isInteger(video.startdelay)) {
      issues.push({
        id: 'Video-V-012',
        severity: 'error',
        fieldPath: `${basePath}.startdelay`,
        message: 'video.startdelay must be an integer',
        actualValue: video.startdelay,
        expectedValue: 'Integer start delay'
      });
    }
  });
};

// Native validation
const validateNative = (bidRequest: any, issues: ValidationIssue[]) => {
  if (!bidRequest.imp) return;

  bidRequest.imp.forEach((imp: any, index: number) => {
    if (!imp.native) return;

    const native = imp.native;
    const basePath = `BidRequest.imp[${index}].native`;

    // Rule 72-73: Request validation
    if (!native.request || typeof native.request !== 'string') {
      issues.push({
        id: 'Native-N-001',
        severity: 'error',
        fieldPath: `${basePath}.request`,
        message: 'native.request must be present and be a string',
        actualValue: native.request,
        expectedValue: 'JSON string'
      });
      return;
    }

    try {
      const nativeRequest = JSON.parse(native.request);

      // Rule 74: Version validation
      if (!nativeRequest.ver) {
        issues.push({
          id: 'Native-N-002',
          severity: 'error',
          fieldPath: `${basePath}.request.ver`,
          message: 'Native request must contain ver (version string)',
          expectedValue: 'Version string (e.g., "1.2")'
        });
      }

      // Rule 76-77: Assets validation
      if (!nativeRequest.assets || !Array.isArray(nativeRequest.assets) || nativeRequest.assets.length === 0) {
        issues.push({
          id: 'Native-N-003',
          severity: 'error',
          fieldPath: `${basePath}.request.assets`,
          message: 'Native request must contain a non-empty assets array',
          actualValue: nativeRequest.assets,
          expectedValue: 'Non-empty array of asset objects'
        });
      } else {
        nativeRequest.assets.forEach((asset: any, assetIndex: number) => {
          if (!asset.id) {
            issues.push({
              id: 'Native-N-004',
              severity: 'error',
              fieldPath: `${basePath}.request.assets[${assetIndex}].id`,
              message: 'Each native asset must have an id',
              expectedValue: 'Integer asset ID'
            });
          }

          const hasTitle = !!asset.title;
          const hasImg = !!asset.img;
          const hasVideo = !!asset.video;
          const hasData = !!asset.data;
          const assetTypeCount = [hasTitle, hasImg, hasVideo, hasData].filter(Boolean).length;

          if (assetTypeCount === 0) {
            issues.push({
              id: 'Native-N-005',
              severity: 'error',
              fieldPath: `${basePath}.request.assets[${assetIndex}]`,
              message: 'Each asset must have either title, img, video, or data',
              expectedValue: 'One of: title, img, video, or data object'
            });
          }
        });
      }
    } catch (error) {
      issues.push({
        id: 'Native-N-006',
        severity: 'error',
        fieldPath: `${basePath}.request`,
        message: 'native.request must be valid JSON',
        actualValue: native.request,
        expectedValue: 'Valid JSON string'
      });
    }
  });
};

// Banner validation
const validateBanner = (bidRequest: any, issues: ValidationIssue[]) => {
  if (!bidRequest.imp) return;

  bidRequest.imp.forEach((imp: any, index: number) => {
    if (!imp.banner) return;

    const banner = imp.banner;
    const basePath = `BidRequest.imp[${index}].banner`;

    // Rule 85-87: Size validation
    const hasWH = banner.w !== undefined && banner.h !== undefined;
    const hasFormat = banner.format && Array.isArray(banner.format);

    if (!hasWH && !hasFormat) {
      issues.push({
        id: 'Banner-B-001',
        severity: 'error',
        fieldPath: basePath,
        message: 'banner must contain either w/h or format array',
        expectedValue: 'Width/height integers or format array'
      });
    }

    if (hasFormat) {
      banner.format.forEach((format: any, formatIndex: number) => {
        if (!format.w || !format.h) {
          issues.push({
            id: 'Banner-B-002',
            severity: 'error',
            fieldPath: `${basePath}.format[${formatIndex}]`,
            message: 'Each format entry must have w and h',
            actualValue: format,
            expectedValue: 'Object with w and h properties'
          });
        }
      });
    }
  });
};

// Site validation
const validateSite = (bidRequest: any, issues: ValidationIssue[]) => {
  if (!bidRequest.site) return;

  const site = bidRequest.site;

  // Rule 30-31: Page URL validation
  if (!site.page || typeof site.page !== 'string') {
    issues.push({
      id: 'Core-Site-001',
      severity: 'error',
      fieldPath: 'BidRequest.site.page',
      message: 'site.page must be present and be a string URL',
      actualValue: site.page,
      expectedValue: 'Valid URL string'
    });
  } else {
    try {
      new URL(site.page);
    } catch {
      issues.push({
        id: 'Core-Site-002',
        severity: 'error',
        fieldPath: 'BidRequest.site.page',
        message: 'site.page must be a valid URL',
        actualValue: site.page,
        expectedValue: 'Valid URL'
      });
    }
  }

  // Rule 32-33: Publisher validation
  if (!site.publisher) {
    issues.push({
      id: 'Core-Site-003',
      severity: 'error',
      fieldPath: 'BidRequest.site.publisher',
      message: 'site.publisher object must be present',
      expectedValue: 'Publisher object with id'
    });
  } else if (!site.publisher.id || typeof site.publisher.id !== 'string') {
    issues.push({
      id: 'Core-Site-004',
      severity: 'error',
      fieldPath: 'BidRequest.site.publisher.id',
      message: 'site.publisher.id must be present and be a string',
      actualValue: site.publisher.id,
      expectedValue: 'Non-empty string'
    });
  }
};

// User validation
const validateUser = (bidRequest: any, issues: ValidationIssue[]) => {
  if (!bidRequest.user) return;

  const user = bidRequest.user;

  // Rule 46: User ID validation
  if (!user.id) {
    issues.push({
      id: 'Core-User-001',
      severity: 'warning',
      fieldPath: 'BidRequest.user.id',
      message: 'user.id (Exchange User ID) should be present',
      expectedValue: 'String user identifier'
    });
  }

  // Rule 47: Buyer UID validation
  if (!user.buyeruid) {
    issues.push({
      id: 'Core-User-002',
      severity: 'warning',
      fieldPath: 'BidRequest.user.buyeruid',
      message: 'user.buyeruid (DSP User ID) should be present for DSPs',
      expectedValue: 'DSP-specific user identifier'
    });
  }
};

// Regulations validation
const validateRegs = (bidRequest: any, issues: ValidationIssue[]) => {
  if (!bidRequest.regs) return;

  const regs = bidRequest.regs;

  // Rule 48: COPPA validation
  if (regs.coppa !== undefined && regs.coppa !== 0 && regs.coppa !== 1) {
    issues.push({
      id: 'Core-Regs-001',
      severity: 'error',
      fieldPath: 'BidRequest.regs.coppa',
      message: 'regs.coppa must be 0 or 1',
      actualValue: regs.coppa,
      expectedValue: '0 or 1'
    });
  }

  // Rule 49-50: GDPR validation
  if (regs.ext?.gdpr !== undefined && regs.ext.gdpr !== 0 && regs.ext.gdpr !== 1) {
    issues.push({
      id: 'Core-Regs-002',
      severity: 'warning',
      fieldPath: 'BidRequest.regs.ext.gdpr',
      message: 'regs.ext.gdpr must be 0 or 1',
      actualValue: regs.ext.gdpr,
      expectedValue: '0 or 1'
    });
  }

  if (regs.ext?.gdpr === 1 && !bidRequest.user?.ext?.consent) {
    issues.push({
      id: 'Core-Regs-003',
      severity: 'error',
      fieldPath: 'BidRequest.user.ext.consent',
      message: 'user.ext.consent (TCF String) must be present when gdpr=1',
      expectedValue: 'Valid TCF consent string'
    });
  }

  // Rule 52-53: GPP validation
  if (regs.gpp && !regs.gpp_sid) {
    issues.push({
      id: 'Core-Regs-004',
      severity: 'error',
      fieldPath: 'BidRequest.regs.gpp_sid',
      message: 'regs.gpp_sid must be present when gpp is specified',
      expectedValue: 'Array of GPP section IDs'
    });
  }
};

// Source validation
const validateSource = (bidRequest: any, issues: ValidationIssue[]) => {
  if (!bidRequest.source) return;

  const source = bidRequest.source;

  // Rule 54-57: Supply Chain validation
  if (!source.schain) {
    issues.push({
      id: 'Core-Source-001',
      severity: 'error',
      fieldPath: 'BidRequest.source.schain',
      message: 'source.schain (SupplyChain Object) must be present',
      expectedValue: 'SupplyChain object'
    });
  } else {
    if (source.schain.complete !== 1) {
      issues.push({
        id: 'Core-Source-002',
        severity: 'error',
        fieldPath: 'BidRequest.source.schain.complete',
        message: 'schain.complete must be 1',
        actualValue: source.schain.complete,
        expectedValue: '1'
      });
    }

    if (!source.schain.nodes || !Array.isArray(source.schain.nodes) || source.schain.nodes.length === 0) {
      issues.push({
        id: 'Core-Source-003',
        severity: 'error',
        fieldPath: 'BidRequest.source.schain.nodes',
        message: 'schain.nodes must be a non-empty array',
        actualValue: source.schain.nodes,
        expectedValue: 'Non-empty array of supply chain nodes'
      });
    } else {
      source.schain.nodes.forEach((node: any, index: number) => {
        if (!node.asi || !node.sid || node.hp === undefined) {
          issues.push({
            id: 'Core-Source-004',
            severity: 'error',
            fieldPath: `BidRequest.source.schain.nodes[${index}]`,
            message: 'Each schain node must contain asi, sid, and hp',
            actualValue: node,
            expectedValue: 'Object with asi, sid, and hp properties'
          });
        }
      });
    }
  }
};

// DOOH validation
const validateDOOH = (bidRequest: any, issues: ValidationIssue[]) => {
  if (!bidRequest.device || bidRequest.device.devicetype !== 6) return;

  // Rule 101-102: DOOH object validation
  const hasDooh = bidRequest.imp?.some((imp: any) => imp.dooh) || bidRequest.dooh;
  
  if (!hasDooh) {
    issues.push({
      id: 'DOOH-001',
      severity: 'error',
      fieldPath: 'BidRequest',
      message: 'DOOH requests must contain dooh object in impression or bid request',
      expectedValue: 'DOOH object with venue information'
    });
  }

  // Check for dooh.venuetype in impressions or bid request
  const doohObjects = [];
  if (bidRequest.dooh) doohObjects.push(bidRequest.dooh);
  if (bidRequest.imp) {
    bidRequest.imp.forEach((imp: any) => {
      if (imp.dooh) doohObjects.push(imp.dooh);
    });
  }

  doohObjects.forEach((dooh: any, index: number) => {
    if (!dooh.venuetype) {
      issues.push({
        id: 'DOOH-002',
        severity: 'error',
        fieldPath: `dooh[${index}].venuetype`,
        message: 'DOOH object must contain venuetype',
        expectedValue: 'Venue type identifier'
      });
    }

    if (!dooh.venuetypetax) {
      issues.push({
        id: 'DOOH-003',
        severity: 'warning',
        fieldPath: `dooh[${index}].venuetypetax`,
        message: 'DOOH object should contain venuetypetax',
        expectedValue: 'Venue type taxonomy identifier'
      });
    }
  });
};

// Advanced validation rules
const validateAdvanced = (bidRequest: any, issues: ValidationIssue[]) => {
  // Rule 115: Macro validation
  const jsonString = JSON.stringify(bidRequest);
  const macroPattern = /\[[\w_]+\]|\{[\w_]+\}/g;
  const macros = jsonString.match(macroPattern);
  
  if (macros && macros.length > 0) {
    issues.push({
      id: 'Advanced-001',
      severity: 'error',
      fieldPath: 'BidRequest',
      message: 'Bid request contains un-replaced macros',
      actualValue: macros.join(', '),
      expectedValue: 'No macros in bid request'
    });
  }

  // Rule 118-119: App/Site consistency
  if (bidRequest.device?.ext?.is_app === 1 && !bidRequest.app) {
    issues.push({
      id: 'Advanced-002',
      severity: 'error',
      fieldPath: 'BidRequest',
      message: 'device.ext.is_app=1 but no app object present',
      expectedValue: 'App object when is_app=1'
    });
  }

  if (bidRequest.device?.ext?.is_app === 0 && !bidRequest.site) {
    issues.push({
      id: 'Advanced-003',
      severity: 'error',
      fieldPath: 'BidRequest',
      message: 'device.ext.is_app=0 but no site object present',
      expectedValue: 'Site object when is_app=0'
    });
  }

  // User EIDs validation
  if (bidRequest.user?.eids) {
    if (!Array.isArray(bidRequest.user.eids)) {
      issues.push({
        id: 'Advanced-004',
        severity: 'warning',
        fieldPath: 'BidRequest.user.eids',
        message: 'user.eids must be an array',
        actualValue: bidRequest.user.eids,
        expectedValue: 'Array of EID objects'
      });
    } else {
      bidRequest.user.eids.forEach((eid: any, index: number) => {
        if (!eid.source || !eid.uids) {
          issues.push({
            id: 'Advanced-005',
            severity: 'error',
            fieldPath: `BidRequest.user.eids[${index}]`,
            message: 'Each EID must have source and uids',
            actualValue: eid,
            expectedValue: 'Object with source and uids properties'
          });
        } else if (Array.isArray(eid.uids)) {
          eid.uids.forEach((uid: any, uidIndex: number) => {
            if (!uid.id) {
              issues.push({
                id: 'Advanced-006',
                severity: 'error',
                fieldPath: `BidRequest.user.eids[${index}].uids[${uidIndex}]`,
                message: 'Each UID must have an id',
                expectedValue: 'Object with id property'
              });
            }
          });
        }
      });
    }
  }
};

// Helper functions
const isValidIPv4 = (ip: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
};

const isValidIPv6 = (ip: string): boolean => {
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv6Regex.test(ip);
};
