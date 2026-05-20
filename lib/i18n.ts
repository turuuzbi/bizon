export type Locale = "mn" | "en";

export const LOCALE_COOKIE = "locale";
export const DEFAULT_LOCALE: Locale = "mn";

type Dictionary = {
  utility: {
    hours: string;
    delivery: string;
    contact: string;
  };
  header: {
    searchPlaceholder: string;
    searchButton: string;
    signIn: string;
    createAccount: string;
    adminPanel: string;
    cart: string;
    favorites: string;
  };
  nav: {
    newArrivals: string;
    brands: string;
    topGifts: string;
    home: string;
    timber: string;
    building: string;
    paint: string;
    tile: string;
    tools: string;
    departments: string;
  };
  hero: {
    eyebrow: string;
    slides: Array<{
      eyebrow: string;
      title: string;
      copy: string;
      cta: string;
      href: string;
    }>;
    sideBadge: string;
    sideTitle: string;
    sideCta: string;
  };
  categoryGrid: {
    eyebrow: string;
    title: string;
    subtitle: string;
    viewAll: string;
  };
  promoStrip: {
    fastDelivery: { title: string; copy: string };
    bulkOrders: { title: string; copy: string };
    expertSupport: { title: string; copy: string };
    securePayment: { title: string; copy: string };
  };
  products: {
    eyebrow: string;
    title: string;
    subtitle: string;
    viewAll: string;
    addToCart: string;
    sku: string;
    noCategory: string;
    emptyTitle: string;
    addProduct: string;
    openCatalog: string;
  };
  featured: {
    eyebrow: string;
    title: string;
    copy: string;
    cta: string;
    benefit1: string;
    benefit2: string;
    benefit3: string;
  };
  brands: {
    eyebrow: string;
    title: string;
  };
  trade: {
    eyebrow: string;
    title: string;
    step1: { title: string; copy: string };
    step2: { title: string; copy: string };
    step3: { title: string; copy: string };
  };
  newsletter: {
    eyebrow: string;
    title: string;
    placeholder: string;
    button: string;
  };
  footer: {
    aboutTitle: string;
    aboutCopy: string;
    companyTitle: string;
    company: {
      about: string;
      careers: string;
      press: string;
      partners: string;
    };
    helpTitle: string;
    help: { faq: string; shipping: string; returns: string; warranty: string };
    contactTitle: string;
    address: string;
    phone: string;
    email: string;
    hoursTitle: string;
    hoursWeekday: string;
    hoursSaturday: string;
    hoursSunday: string;
    rights: string;
    follow: string;
  };
  language: {
    label: string;
    mn: string;
    en: string;
  };
  productsPage: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    statsResults: string;
    statsWithPhotos: string;
    statsFeatured: string;
    searchLabel: string;
    searchPlaceholder: string;
    statusLabel: string;
    sortLabel: string;
    apply: string;
    reset: string;
    allProducts: string;
    allStatuses: string;
    statusActive: string;
    statusDraft: string;
    statusArchived: string;
    sortFeatured: string;
    sortNewest: string;
    sortNameAsc: string;
    sortNameDesc: string;
    currentView: string;
    showingInCategory: string;
    showingFullCatalog: string;
    searchPrefix: string;
    narrowHint: string;
    cardFallback: string;
    skuPending: string;
    catalogTagline: string;
    badgeNew: string;
    noResults: string;
    noProductsMatch: string;
    noMatchInCategory: string;
    noMatchHint: string;
    resetFilters: string;
  };
  productStatus: {
    DRAFT: string;
    ACTIVE: string;
    ARCHIVED: string;
  };
  unit: Record<string, string>;
  orderStatus: Record<string, string>;
  admin: {
    metaTitle: string;
    metaDescription: string;
    clerkRequiredEyebrow: string;
    clerkRequiredTitle: string;
    clerkRequiredCopy: string;
    backToStorefront: string;
    backToStore: string;
    controlCenter: string;
    panelTitle: string;
    panelCopy: string;
    signedInAs: string;
    role: string;
    navOverview: string;
    navProducts: string;
    navCatalogData: string;
    navOrders: string;
    navCustomers: string;
    protectedWorkspace: string;
    protectedCopy: string;
    viewStorefront: string;
    overview: {
      databaseSetup: string;
      dataNotReadyTitle: string;
      dataNotReadyCopy: string;
      eyebrow: string;
      title: string;
      copy: string;
      authBlock: string;
      openProductOps: string;
      products: string;
      orders: string;
      customers: string;
      catalogGroups: string;
      productsNote: string;
      ordersNote: string;
      customersNote: string;
      catalogNote: string;
      catalogActivity: string;
      recentlyUpdatedProducts: string;
      sku: string;
      notSet: string;
      featured: string;
      updated: string;
      noProductsYet: string;
      orderDesk: string;
      latestOrderFlow: string;
      created: string;
      ordersAppearHere: string;
      customerAccess: string;
      recentUsersTitle: string;
      recentUsersCopy: string;
      noEmailOnFile: string;
      active: string;
      disabled: string;
      joined: string;
      unnamedUser: string;
      noSyncedUsers: string;
      adminUser: string;
    };
    productOps: {
      eyebrow: string;
      title: string;
      copy: string;
      addProduct: string;
      downloadTemplate: string;
      allProducts: string;
      active: string;
      draft: string;
      archived: string;
      searchProducts: string;
      searchPlaceholder: string;
      statusFilter: string;
      allStatuses: string;
      filter: string;
      productCol: string;
      organizationCol: string;
      statusCol: string;
      metadataCol: string;
      actionsCol: string;
      brand: string;
      noBrand: string;
      primaryCategory: string;
      none: string;
      categoryLinks: string;
      variants: string;
      published: string;
      notPublished: string;
      edit: string;
      noMatch: string;
      featured: string;
      newBadge: string;
      spreadsheetImport: string;
      importTitle: string;
      importCopy: string;
      workbookFile: string;
      howItWorks: string;
      importHint1: string;
      importHint2: string;
      importHint3: string;
      importHint4: string;
      supportedColumns: string;
      supportedColumnsList: string;
      importSheet: string;
      importing: string;
      downloadTemplateBtn: string;
    };
    productForm: {
      backToProducts: string;
      newPageTitle: string;
      newPageCopy: string;
      editPageCopy: string;
      createProduct: string;
      creating: string;
      saveChanges: string;
      saving: string;
      editorEyebrow: string;
      productName: string;
      slug: string;
      slugPlaceholder: string;
      sku: string;
      currency: string;
      status: string;
      baseUnit: string;
      shortDescription: string;
      fullDescription: string;
      brand: string;
      noBrandSelected: string;
      newBrandName: string;
      newBrandPlaceholder: string;
      primaryCategory: string;
      noPrimaryCategory: string;
      categorySelection: string;
      noCategoriesHint: string;
      newCategories: string;
      newCategoriesPlaceholder: string;
      productImageEntries: string;
      imageEntriesPlaceholder: string;
      imageGuide: string;
      imageGuideCopy1: string;
      imageGuideCopy2: string;
      currentImagePreview: string;
      primary: string;
      imageN: string;
      publishedAt: string;
      trackInventory: string;
      allowBackorder: string;
      featuredProduct: string;
      newArrival: string;
      seoTitle: string;
      seoDescription: string;
      inactive: string;
    };
    deleteButton: {
      delete: string;
      deleting: string;
      confirmDelete: string;
    };
    actions: {
      somethingWrong: string;
      uploadFirst: string;
      created: string;
      updated: string;
      deleted: string;
      importFinished: string;
      rowsFailed: string;
    };
  };
  signInPage: {
    eyebrow: string;
    title: string;
    copy: string;
    feature1: string;
    feature2: string;
    feature3: string;
    backToStorefront: string;
  };
  signUpPage: {
    eyebrow: string;
    title: string;
    copy: string;
    feature1: string;
    feature2: string;
    feature3: string;
    backToStorefront: string;
  };
  chat: {
    openLabel: string;
    closeLabel: string;
    title: string;
    subtitle: string;
    welcome: string;
    inputPlaceholder: string;
    sendLabel: string;
    thinking: string;
    fallbackError: string;
    fallbackEmpty: string;
    messageLabel: string;
  };
};

const dictionaries: Record<Locale, Dictionary> = {
  mn: {
    utility: {
      hours: "Лхагва-Даваа: 9:00-19:00",
      delivery: "",
      contact: "Холбоо барих: 94051288 89251288",
    },
    header: {
      searchPlaceholder: "Бараа, брэнд, ангилал хайх...",
      searchButton: "Хайх",
      signIn: "Нэвтрэх",
      createAccount: "Бүртгүүлэх",
      adminPanel: "Админ",
      cart: "Сагс",
      favorites: "Хадгалсан",
    },
    nav: {
      newArrivals: "Шинэ бүтээгдэхүүн",
      brands: "Брэндүүд",
      topGifts: "Онцлох бэлэг",
      home: "Гэр ахуй",
      timber: "Мод, хавтан",
      building: "Барилгын материал",
      paint: "Будаг, өнгөлгөө",
      tile: "Плита, чулуу",
      tools: "Багаж, хэрэгсэл",
      departments: "Бүх ангилал",
    },
    hero: {
      eyebrow: "Эркагийн барилгын материал",
      slides: [
        {
          eyebrow: "Шинэ цуглуулга",
          title: "Өндөр чанартай мод, хавтан таны төсөлд",
          copy: "Дотоод болон гадаа хэрэглээнд тохирох фанер, MDF, OSB хавтан өргөн сонголттой.",
          cta: "Цуглуулга үзэх",
          href: "/products?category=timber-and-board",
        },
        {
          eyebrow: "Профессионал ангилал",
          title: "Будаг, өнгөлгөөний материал — бүх өнгөөр",
          copy: "Өнгө тааруулах үйлчилгээ, сорьц, мэргэжлийн зөвлөгөөтэйгээр.",
          cta: "Будаг сонгох",
          href: "/products?category=paint-and-finish",
        },
        {
          eyebrow: "Багаж хэрэгсэл",
          title: "Барилгын талбайн өдөр тутмын хэрэгсэл",
          copy: "Гар багаж, хэмжилтийн төхөөрөмж, монтажийн материал нэг дороос.",
          cta: "Багаж үзэх",
          href: "/products?category=tools-and-site",
        },
      ],
      sideBadge: "Долоо хоногийн санал",
      sideTitle: "Олон тооны захиалгад 15% хүртэлх хөнгөлөлт",
      sideCta: "Үнийн санал авах",
    },
    categoryGrid: {
      eyebrow: "Ангилал",
      title: "Бүх барилгын материал нэг дороос",
      subtitle: "Танд хэрэгтэй ангилалаар шууд орж, каталогоосоо хайгаарай.",
      viewAll: "Бүх каталог нээх",
    },
    promoStrip: {
      fastDelivery: { title: "Хурдан хүргэлт", copy: "Хот дотор 24 цагт" },
      bulkOrders: { title: "Бөөний захиалга", copy: "Тусгай үнэ, нэхэмжлэх" },
      expertSupport: {
        title: "Мэргэжлийн зөвлөгөө",
        copy: "Туршлагатай мэргэжилтнүүд",
      },
      securePayment: {
        title: "Найдвартай төлбөр",
        copy: "Карт, шилжүүлэг, бэлэн",
      },
    },
    products: {
      eyebrow: "Шинээр нэмэгдсэн",
      title: "Каталогийн хамгийн сүүлийн бараа",
      subtitle: "Эркагийн каталогийн жинхэнэ өгөгдөл дээр үндэслэсэн.",
      viewAll: "Бүгдийг үзэх",
      addToCart: "Сагсанд нэмэх",
      sku: "Код",
      noCategory: "Ангилалгүй",
      emptyTitle: "Админ хэсгээс шинэ бараа нэмэхэд эндээс харагдана.",
      addProduct: "Бараа нэмэх",
      openCatalog: "Каталог нээх",
    },
    featured: {
      eyebrow: "Онцлох цуглуулга",
      title: "Elfa — гэрээ цэгцлэх ухаалаг шийдэл",
      copy: "Хувцасны өрөө, агуулах, гараж, оффисын зориулалттай модуль системийг өөрийн орон зайд тааруулан хийгээрэй.",
      cta: "Цуглуулга үзэх",
      benefit1: "Хэмжээнд тааруулсан суурилуулалт",
      benefit2: "Шведийн чанартай үйлдвэрлэл",
      benefit3: "10 жилийн баталгаатай",
    },
    brands: {
      eyebrow: "Бидний хамтрагч брэндүүд",
      title: "Дэлхийд танигдсан үйлдвэрлэгчид",
    },
    trade: {
      eyebrow: "Барилгачдад зориулсан",
      title: "Давтан захиалга, төслийн нийлүүлэлтэд бэлэн",
      step1: {
        title: "Жагсаалтаа илгээнэ үү",
        copy: "Хэрэгцээт бараа, дуртай брэнд, ойролцоо тоо хэмжээгээ илгээнэ.",
      },
      step2: {
        title: "Нөөц шалгана",
        copy: "Каталогоос ангилал, нөөцийг шуурхай батална.",
      },
      step3: {
        title: "Хүргэлт төлөвлөнө",
        copy: "Зорилтот огноо, дүүрэг, давтан захиалгын дэлгэрэнгүйг нэг дороос.",
      },
    },
    newsletter: {
      eyebrow: "Цахим шуудан",
      title: "Шинэ бараа, хямдралын мэдээллийг хамгийн түрүүнд аваарай",
      placeholder: "Имэйл хаягаа оруулна уу",
      button: "Бүртгүүлэх",
    },
    footer: {
      aboutTitle: "Эрка — Барилгын материал",
      aboutCopy:
        "Улаанбаатар хотын барилгачид, өрхийн хэрэглэгчдэд зориулсан найдвартай нийлүүлэгч.",
      companyTitle: "Компани",
      company: {
        about: "Бидний тухай",
        careers: "Ажлын байр",
        press: "Хэвлэлийн мэдээ",
        partners: "Хамтрагчид",
      },
      helpTitle: "Тусламж",
      help: {
        faq: "Түгээмэл асуулт",
        shipping: "Хүргэлтийн нөхцөл",
        returns: "Буцаалт",
        warranty: "Баталгаа",
      },
      contactTitle: "Холбоо барих",
      address: "OУХТ Нарантуул зах, УБ",
      phone: "+976 94051288",
      email: "sbolorsaikhan4@gmail.com",
      hoursTitle: "Ажиллах цаг",
      hoursWeekday: "Лхагва-Даваа: 9:00-19:00",
      hoursSunday: "Мягмар: Амарна",
      rights: "Бүх эрх хуулиар хамгаалагдсан.",
      follow: "Дагах",
      hoursSaturday: "",
    },
    language: { label: "Хэл", mn: "Монгол", en: "English" },
    productsPage: {
      metaTitle: "Бараа | Эрка",
      metaDescription: "Эркагийн каталогийг шинэ загвартай үзэгчээр хайгаарай.",
      eyebrow: "Барааны каталог",
      title: "Ангилалаар сонгоод, хайлт, эрэмбээр нарийсгана уу.",
      subtitle:
        "Ангилал эхэнд, шүүлтүүр дараа, бараа нь том зурагтай — энгийн харагдацтай.",
      statsResults: "Үр дүн",
      statsWithPhotos: "Зурагтай",
      statsFeatured: "Онцлох",
      searchLabel: "Хайх",
      searchPlaceholder: "Бараа, код, брэнд...",
      statusLabel: "Төлөв",
      sortLabel: "Эрэмбэлэх",
      apply: "Хэрэглэх",
      reset: "Цэвэрлэх",
      allProducts: "Бүх бараа",
      allStatuses: "Бүх төлөв",
      statusActive: "Идэвхтэй",
      statusDraft: "Ноорог",
      statusArchived: "Архив",
      sortFeatured: "Онцлох эхэндээ",
      sortNewest: "Шинэ эхэндээ",
      sortNameAsc: "Нэр А-Я",
      sortNameDesc: "Нэр Я-А",
      currentView: "Одоогийн харагдац",
      showingInCategory: "{name} ангилалын бараа",
      showingFullCatalog: "Бүх каталог харагдаж байна.",
      searchPrefix: "Хайлт:",
      narrowHint: "Хайлт эсвэл ангилалаар нарийсгана уу.",
      cardFallback: "Бараа гэрэл зураг, нарийн мэдээллээр баяжих боломжтой.",
      skuPending: "Код хүлээгдэж байна",
      catalogTagline: "Эркагийн каталог",
      badgeNew: "Шинэ",
      noResults: "Үр дүн алга",
      noProductsMatch: "Энэ харагдацад бараа алга.",
      noMatchInCategory: "{name} ангилалд тохирох бараа алга.",
      noMatchHint: "Өөр ангилал, хайлт эсвэл төлөв сонгоно уу.",
      resetFilters: "Шүүлтүүр цэвэрлэх",
    },
    productStatus: {
      DRAFT: "Ноорог",
      ACTIVE: "Идэвхтэй",
      ARCHIVED: "Архив",
    },
    unit: {
      PIECE: "Ширхэг",
      BOX: "Хайрцаг",
      PACK: "Багц",
      SET: "Багц",
      METER: "Метр",
      SQUARE_METER: "Метр квадрат",
      CUBIC_METER: "Метр куб",
      LITER: "Литр",
      KILOGRAM: "Килограмм",
      TON: "Тонн",
      ROLL: "Ороомог",
      SHEET: "Хуудас",
      BAG: "Уут",
      BUCKET: "Хувин",
      GALLON: "Галлон",
    },
    orderStatus: {
      PENDING: "Хүлээгдэж буй",
      CONFIRMED: "Баталсан",
      PROCESSING: "Боловсруулж буй",
      SHIPPED: "Илгээсэн",
      DELIVERED: "Хүргэгдсэн",
      CANCELLED: "Цуцалсан",
      REFUNDED: "Буцаалт",
    },
    admin: {
      metaTitle: "Админ | Эрка",
      metaDescription: "Эркагийн админ удирдлага",
      clerkRequiredEyebrow: "Clerk тохиргоо шаардлагатай",
      clerkRequiredTitle:
        "Админ хэсэг бэлэн, гэхдээ Clerk түлхүүр шаардлагатай.",
      clerkRequiredCopy:
        "Эхлээд .env файлд Clerk-ийн нийтийн түлхүүр, нууц түлхүүр, чиглүүлэлтийн URL-уудыг нэмнэ үү. Дараа нь `ADMIN_EMAILS`-д орсон имэйлээр нэвтрэх эсвэл `ADMIN_CLERK_USER_IDS`-д өөрийнхөө Clerk ID-г нэмж админ эрхийг идэвхжүүлнэ үү.",
      backToStorefront: "Дэлгүүр рүү буцах",
      backToStore: "Дэлгүүр рүү буцах",
      controlCenter: "Удирдлагын төв",
      panelTitle: "Эрка админ панель",
      panelCopy:
        "Каталог, захиалга, харилцагчийн идэвхийг нэг ажлын талбараас сервер талын эрх шалгалттайгаар удирдана.",
      signedInAs: "Нэвтэрсэн",
      role: "Эрх",
      navOverview: "Тойм",
      navProducts: "Бараа",
      navCatalogData: "Каталогийн өгөгдөл",
      navOrders: "Захиалга",
      navCustomers: "Харилцагч",
      protectedWorkspace: "Хамгаалагдсан ажлын талбар",
      protectedCopy: "Эрх шалгалттай админ хандалт идэвхтэй.",
      viewStorefront: "Дэлгүүрийг харах",
      overview: {
        databaseSetup: "Өгөгдлийн сангийн тохиргоо",
        dataNotReadyTitle:
          "Админ бүрхүүл идэвхтэй боловч өгөгдлийн давхарга бэлэн биш байна.",
        dataNotReadyCopy:
          "Prisma-г Neon өгөгдлийн сантай холбож, схемийг push хийсэн эсэхийг шалгана уу.",
        eyebrow: "Тойм",
        title: "Жинхэнэ өгөгдөл, сервер талын эрх шалгалт, бэлэн админ суурь.",
        copy: "Энэ хяналтын самбар Prisma схемээс шууд уншдаг тул статик загвар биш бодит ажилладаг.",
        authBlock:
          "Auth: Clerk\nЭрх: Prisma `User.role`\nҮндсэн админ: `ADMIN_EMAILS` эсвэл `ADMIN_CLERK_USER_IDS`",
        openProductOps: "Барааны үйл ажиллагаа нээх",
        products: "Бараа",
        orders: "Захиалга",
        customers: "Харилцагч",
        catalogGroups: "Каталогийн бүлэг",
        productsNote: "{count} идэвхтэй",
        ordersNote: "{count} явагдаж буй",
        customersNote: "{count} админ",
        catalogNote: "{count} брэнд",
        catalogActivity: "Каталогийн идэвх",
        recentlyUpdatedProducts: "Сүүлд шинэчлэгдсэн бараа",
        sku: "Код",
        notSet: "Тохируулаагүй",
        featured: "Онцлох",
        updated: "Шинэчлэгдсэн",
        noProductsYet:
          "Бараа алга. Каталогт бараа нэмэх бүрд энд автоматаар харагдана.",
        orderDesk: "Захиалгын ширээ",
        latestOrderFlow: "Сүүлийн захиалгын урсгал",
        created: "Үүсгэсэн",
        ordersAppearHere: "Захиалга үүсэх бүрд энд харагдана.",
        customerAccess: "Харилцагчийн хандалт",
        recentUsersTitle:
          "Clerk-аас Prisma руу синхрончлогдсон шинэ хэрэглэгчид",
        recentUsersCopy:
          "Шинэ хэрэглэгчид анх хандах үед локал `User` хүснэгтэд үүсэж, дараа нь `User.role` дээр админ шалгалт ажилладаг.",
        noEmailOnFile: "Имэйл бүртгэлгүй",
        active: "Идэвхтэй",
        disabled: "Идэвхгүй",
        joined: "Бүртгүүлсэн",
        unnamedUser: "Нэргүй хэрэглэгч",
        noSyncedUsers:
          "Синхрончлогдсон хэрэглэгч алга. Clerk-ээр нэвтэрсний дараа автоматаар харагдана.",
        adminUser: "Админ хэрэглэгч",
      },
      productOps: {
        eyebrow: "Барааны үйл ажиллагаа",
        title: "Бараа, ангилал, Excel импортыг удирдана.",
        copy: "Энэ хэсэгт Prisma схемийн эсрэг бодит үүсгэх, засах, устгах, Excel импортын урсгалууд ажиллана.",
        addProduct: "Бараа нэмэх",
        downloadTemplate: "Загвар татах",
        allProducts: "Бүх бараа",
        active: "Идэвхтэй",
        draft: "Ноорог",
        archived: "Архив",
        searchProducts: "Бараа хайх",
        searchPlaceholder: "нэр, slug, эсвэл код",
        statusFilter: "Төлвөөр шүүх",
        allStatuses: "Бүх төлөв",
        filter: "Шүүх",
        productCol: "Бараа",
        organizationCol: "Зохион байгуулалт",
        statusCol: "Төлөв",
        metadataCol: "Мэдээлэл",
        actionsCol: "Үйлдэл",
        brand: "Брэнд",
        noBrand: "Брэндгүй",
        primaryCategory: "Үндсэн ангилал",
        none: "Алга",
        categoryLinks: "Ангилалын холбоос",
        variants: "Хувилбар",
        published: "Нийтэлсэн",
        notPublished: "Нийтлэгдээгүй",
        edit: "Засах",
        noMatch: "Шүүлтүүртэй тохирох бараа алга.",
        featured: "Онцлох",
        newBadge: "Шинэ",
        spreadsheetImport: "Excel импорт",
        importTitle: "Excel хүснэгтийг каталогийн ажилд холбоно уу",
        importCopy:
          "`.xlsx`, `.xls` эсвэл `.csv` оруулна. Импорт нь `sku` дараа `slug`-ээр бараа үүсгэх эсвэл шинэчилнэ. Брэнд, ангилалыг нэрээр нь тааруулна.",
        workbookFile: "Файл сонгох",
        howItWorks: "Хэрхэн ажилладаг:",
        importHint1:
          "`Products` нэртэй хуудас ашиглах эсвэл эхний хуудсыг автоматаар уншина.",
        importHint2:
          "`sku` олдвол тухайн мөр баруусгана. `sku` олдохгүй бол `slug` шалгана. Аль нь ч тохирохгүй бол шинэ бараа үүсгэнэ.",
        importHint3:
          "Ангилалын жагсаалтыг `|`, таслал эсвэл шинэ мөрөөр салгана. Зургийн мөрөнд `url | alt text` хэлбэр ашиглана.",
        importHint4:
          "`Бараа нэр`, `Ангилал`, `Хэмжээ`, `Тайлбар` гэх мэт монгол толгойтой хуудас бас дэмжинэ.",
        supportedColumns: "Дэмжигдсэн багана:",
        supportedColumnsList:
          "`name`, `sku`, `slug`, `status`, `brand`, `primaryCategory`, `categories`, `shortDescription`, `description`, `currency`, `baseUnit`, `trackInventory`, `allowBackorder`, `isFeatured`, `isNewArrival`, `seoTitle`, `seoDescription`, `publishedAt`, `images`",
        importSheet: "Хуудас оруулах",
        importing: "Оруулж байна...",
        downloadTemplateBtn: "Загвар татах",
      },
      productForm: {
        backToProducts: "Бараа руу буцах",
        newPageTitle: "Шинэ бараа нэмэх",
        newPageCopy:
          "Эхлээд үндсэн бараа үүсгэе. Хувилбар, нарийвчилсан мэдээлэл, зургийг дараа нэмж болно.",
        editPageCopy: "Үндсэн мэдээлэл, ангилал, онцлох тэмдэглэгээг засна уу.",
        createProduct: "Бараа үүсгэх",
        creating: "Үүсгэж байна...",
        saveChanges: "Хадгалах",
        saving: "Хадгалж байна...",
        editorEyebrow: "Барааны засвар",
        productName: "Бараа нэр",
        slug: "Slug",
        slugPlaceholder: "хоосон үлдээвэл нэрнээс автоматаар үүснэ",
        sku: "Код",
        currency: "Валют",
        status: "Төлөв",
        baseUnit: "Үндсэн нэгж",
        shortDescription: "Богино тайлбар",
        fullDescription: "Бүрэн тайлбар",
        brand: "Брэнд",
        noBrandSelected: "Брэнд сонгоогүй",
        newBrandName: "Шинэ брэндийн нэр",
        newBrandPlaceholder: "сонголтоор: нэрээр шинэ эсвэл одоо байгаа брэнд",
        primaryCategory: "Үндсэн ангилал",
        noPrimaryCategory: "Үндсэн ангилал алга",
        categorySelection: "Ангилал сонгох",
        noCategoriesHint:
          "Одоогоор ангилал алга. Доор таслалаар тусгаарлан шинээр үүсгэж болно.",
        newCategories: "Шинэ ангилал",
        newCategoriesPlaceholder: "жишээ: Плита, Угаалга, Цахилгаан",
        productImageEntries: "Барааны зургийн жагсаалт",
        imageEntriesPlaceholder:
          "https://example.com/chair-front.jpg | Урд тал\nhttps://example.com/chair-side.jpg | Хажуу тал",
        imageGuide: "Зургийн заавар",
        imageGuideCopy1:
          "Нэг зураг — нэг мөр. `зургийн-url | alt текст` хэлбэр. Эхний хүчинтэй мөр үндсэн каталогийн зураг болно.",
        imageGuideCopy2:
          "Энэхүү тохиргоо нь хадгалалт тохируулалгүйгээр зөвхөн URL ашиглан хурдан удирдах боломжтой.",
        currentImagePreview: "Одоогийн зургийн харагдац",
        primary: "Үндсэн",
        imageN: "Зураг {n}",
        publishedAt: "Нийтэлсэн огноо",
        trackInventory: "Үлдэгдэл хянах",
        allowBackorder: "Урьдчилсан захиалга зөвшөөрөх",
        featuredProduct: "Онцлох бараа",
        newArrival: "Шинэ бараа",
        seoTitle: "SEO гарчиг",
        seoDescription: "SEO тайлбар",
        inactive: "идэвхгүй",
      },
      deleteButton: {
        delete: "Бараа устгах",
        deleting: "Устгаж байна...",
        confirmDelete: "{name}-г устгах уу? Энэ үйлдлийг буцаах боломжгүй.",
      },
      actions: {
        somethingWrong: "Алдаа гарлаа.",
        uploadFirst: "Эхлээд Excel эсвэл CSV файл оруулна уу.",
        created: "{name} үүсгэгдсэн.",
        updated: "{name} шинэчлэгдсэн.",
        deleted: "{name} устгагдсан.",
        importFinished:
          "Импорт дууссан: {created} үүссэн, {updated} шинэчилсэн, {skipped} алгассан.",
        rowsFailed: "{count} мөр амжилтгүй боллоо. {first}",
      },
    },
    signInPage: {
      eyebrow: "Эркагийн данс",
      title: "Бүртгэлтэй захиалга, каталог, админ хандалтад нэвтэрнэ үү.",
      copy: "Эхлээд Clerk нэвтрэлтийг шалгаж, дараа нь Эрка дансыг локал Prisma `User` хүснэгтэд синхрончилно.",
      feature1: "Аюулгүй нэвтрэлт",
      feature2: "Эрхтэй админ",
      feature3: "Neon + Prisma",
      backToStorefront: "Дэлгүүр рүү буцах",
    },
    signUpPage: {
      eyebrow: "Эркагийн данс",
      title: "Каталог, төслийн ажилд зориулсан данс үүсгэнэ үү.",
      copy: "Шинэ хэрэглэгчид анх хандах үед Prisma-д синхрончлогдоно. Үндсэн админ тохиргоонд тохирвол админ эрх автоматаар нээгдэнэ.",
      feature1: "Харилцагчийн данс",
      feature2: "Худалдааны эрхүүд",
      feature3: "Админ үндсэн тохиргоо",
      backToStorefront: "Дэлгүүр рүү буцах",
    },
    chat: {
      openLabel: "Барааны туслахыг нээх",
      closeLabel: "Барааны туслахыг хаах",
      title: "Барааны туслах",
      subtitle: "Каталогоос бараа олж өгнө",
      welcome:
        "Сайн уу, тохирох бараа сонгоход тань туслая. Юу барьж байгаа, засварлаж байгаа, хэмжээгээ хэлээрэй.",
      inputPlaceholder: "Ямар ажил хийж байна вэ?",
      sendLabel: "Илгээх",
      thinking: "Бодож байна...",
      fallbackError: "Туслах хариу өгч чадсангүй.",
      fallbackEmpty: "Тодорхой хариу олдсонгүй. Илүү дэлгэрэнгүй хэлж өгнө үү?",
      messageLabel: "Барааны туслах руу мессеж бичих",
    },
  },
  en: {
    utility: {
      hours: "Mon-Fri 9:00-19:00 · Sat 10:00-17:00",
      delivery: "Free delivery in the city for orders ₮150,000+",
      contact: "Contact: 7711-8899",
    },
    header: {
      searchPlaceholder: "Search products, brands, categories...",
      searchButton: "Search",
      signIn: "Sign in",
      createAccount: "Create account",
      adminPanel: "Admin",
      cart: "Cart",
      favorites: "Saved",
    },
    nav: {
      newArrivals: "New Arrivals",
      brands: "Brands",
      topGifts: "Top Gifts",
      home: "Home & Living",
      timber: "Timber & Board",
      building: "Building Materials",
      paint: "Paint & Finish",
      tile: "Tile & Stone",
      tools: "Tools & Site",
      departments: "All Departments",
    },
    hero: {
      eyebrow: "Erka's Building Materials",
      slides: [
        {
          eyebrow: "New Collection",
          title: "Premium timber and boards for every project",
          copy: "Plywood, MDF, and OSB for indoor and outdoor use, with a wide selection of finishes.",
          cta: "Shop collection",
          href: "/products?category=timber-and-board",
        },
        {
          eyebrow: "Professional grade",
          title: "Paint and finish — in every color you need",
          copy: "Color matching service, real samples, and expert guidance.",
          cta: "Browse paint",
          href: "/products?category=paint-and-finish",
        },
        {
          eyebrow: "Tools & site",
          title: "Daily site essentials, all in one place",
          copy: "Hand tools, measurement, and install hardware ready to ship.",
          cta: "Shop tools",
          href: "/products?category=tools-and-site",
        },
      ],
      sideBadge: "Deal of the week",
      sideTitle: "Up to 15% off on bulk orders",
      sideCta: "Request a quote",
    },
    categoryGrid: {
      eyebrow: "Departments",
      title: "Every building material in one place",
      subtitle:
        "Jump straight to the department you need and dive into the catalog.",
      viewAll: "Open full catalog",
    },
    promoStrip: {
      fastDelivery: {
        title: "Fast delivery",
        copy: "Citywide within 24 hours",
      },
      bulkOrders: {
        title: "Bulk orders",
        copy: "Trade pricing and invoices",
      },
      expertSupport: {
        title: "Expert support",
        copy: "On-staff specialists",
      },
      securePayment: { title: "Secure payment", copy: "Card, transfer, cash" },
    },
    products: {
      eyebrow: "Latest in catalog",
      title: "Fresh arrivals from our catalog",
      subtitle: "Sourced from the same real data as the catalog page.",
      viewAll: "View all",
      addToCart: "Add to cart",
      sku: "SKU",
      noCategory: "No category",
      emptyTitle: "Add your next products in admin and they will surface here.",
      addProduct: "Add product",
      openCatalog: "Open catalog",
    },
    featured: {
      eyebrow: "Featured collection",
      title: "Elfa — smart storage for every room",
      copy: "Modular wardrobe, pantry, garage, and office systems, fitted to your exact space.",
      cta: "Explore Elfa",
      benefit1: "Custom-fit installation",
      benefit2: "Swedish-engineered quality",
      benefit3: "Backed by a 10-year warranty",
    },
    brands: {
      eyebrow: "Our partner brands",
      title: "Globally trusted manufacturers",
    },
    trade: {
      eyebrow: "Trade support",
      title: "Built for repeat ordering and project supply",
      step1: {
        title: "Share the list",
        copy: "Send the item mix, preferred brands, and rough quantities first.",
      },
      step2: {
        title: "Check availability",
        copy: "Use the catalog to confirm departments and narrow the shortlist.",
      },
      step3: {
        title: "Plan delivery",
        copy: "Keep dates, district, and repeat ordering notes in one place.",
      },
    },
    newsletter: {
      eyebrow: "Newsletter",
      title: "Be first to hear about new arrivals and deals",
      placeholder: "Enter your email",
      button: "Subscribe",
    },
    footer: {
      aboutTitle: "Erka — Building Materials",
      aboutCopy:
        "A reliable supplier for builders and households across Ulaanbaatar.",
      companyTitle: "Company",
      company: {
        about: "About us",
        careers: "Careers",
        press: "Press",
        partners: "Partners",
      },
      helpTitle: "Help",
      help: {
        faq: "FAQ",
        shipping: "Shipping",
        returns: "Returns",
        warranty: "Warranty",
      },
      contactTitle: "Contact",
      address: "Sukhbaatar district, Baga toiruu, UB",
      phone: "+976 7711-8899",
      email: "hello@erkas.mn",
      hoursTitle: "Opening hours",
      hoursWeekday: "Mon-Fri: 9:00-19:00",
      hoursSaturday: "Sat: 10:00-17:00",
      hoursSunday: "Sun: Closed",
      rights: "All rights reserved.",
      follow: "Follow",
    },
    language: { label: "Language", mn: "Монгол", en: "English" },
    productsPage: {
      metaTitle: "Products | Erka's",
      metaDescription:
        "Browse the Erka's catalog in a clean, photo-ready product viewer.",
      eyebrow: "Product catalog",
      title: "Browse by department, then narrow the list with search and sort.",
      subtitle:
        "The layout stays simple on purpose: categories first, filters second, and image-ready cards.",
      statsResults: "Results",
      statsWithPhotos: "With photos",
      statsFeatured: "Featured",
      searchLabel: "Search",
      searchPlaceholder: "Product, SKU, brand...",
      statusLabel: "Status",
      sortLabel: "Sort",
      apply: "Apply",
      reset: "Reset",
      allProducts: "All products",
      allStatuses: "All statuses",
      statusActive: "Active",
      statusDraft: "Draft",
      statusArchived: "Archived",
      sortFeatured: "Featured first",
      sortNewest: "Newest first",
      sortNameAsc: "Name A-Z",
      sortNameDesc: "Name Z-A",
      currentView: "Current view",
      showingInCategory: "Showing products in {name}.",
      showingFullCatalog: "Showing the full catalog.",
      searchPrefix: "Search:",
      narrowHint: "Use search or category chips to narrow the list.",
      cardFallback:
        "Ready for product photography, specs, and fuller merchandising.",
      skuPending: "SKU pending",
      catalogTagline: "Erka's catalog",
      badgeNew: "New",
      noResults: "No results",
      noProductsMatch: "No products match this view.",
      noMatchInCategory: "Nothing matched the current filters inside {name}.",
      noMatchHint: "Try another category, search term, or status filter.",
      resetFilters: "Reset filters",
    },
    productStatus: {
      DRAFT: "Draft",
      ACTIVE: "Active",
      ARCHIVED: "Archived",
    },
    unit: {
      PIECE: "Piece",
      BOX: "Box",
      PACK: "Pack",
      SET: "Set",
      METER: "Meter",
      SQUARE_METER: "Square meter",
      CUBIC_METER: "Cubic meter",
      LITER: "Liter",
      KILOGRAM: "Kilogram",
      TON: "Ton",
      ROLL: "Roll",
      SHEET: "Sheet",
      BAG: "Bag",
      BUCKET: "Bucket",
      GALLON: "Gallon",
    },
    orderStatus: {
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      PROCESSING: "Processing",
      SHIPPED: "Shipped",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
      REFUNDED: "Refunded",
    },
    admin: {
      metaTitle: "Admin | Erka's",
      metaDescription: "Erka's admin dashboard",
      clerkRequiredEyebrow: "Clerk Setup Required",
      clerkRequiredTitle: "Admin panel is ready, but Clerk still needs keys.",
      clerkRequiredCopy:
        "Add your Clerk publishable key, secret key, and redirect URLs to the env file first. After that, sign in with an email listed in `ADMIN_EMAILS` or add your Clerk user ID to `ADMIN_CLERK_USER_IDS` to bootstrap admin access.",
      backToStorefront: "Back to storefront",
      backToStore: "Back to store",
      controlCenter: "Control center",
      panelTitle: "Erka's admin panel",
      panelCopy:
        "Catalog, orders, and customer activity in one calm workspace with server-side role protection.",
      signedInAs: "Signed in as",
      role: "Role",
      navOverview: "Overview",
      navProducts: "Products",
      navCatalogData: "Catalog data",
      navOrders: "Orders",
      navCustomers: "Customers",
      protectedWorkspace: "Protected workspace",
      protectedCopy: "Role-checked admin access is active.",
      viewStorefront: "View storefront",
      overview: {
        databaseSetup: "Database setup",
        dataNotReadyTitle:
          "The admin shell is live, but the data layer is not ready yet.",
        dataNotReadyCopy:
          "Connect Prisma to your Neon database and make sure the schema has been pushed before loading dashboard data.",
        eyebrow: "Overview",
        title:
          "Real data, server-side role checks, and a ready admin foundation.",
        copy: "This dashboard reads directly from your Prisma schema so the first version already works as a real control panel instead of a static mock.",
        authBlock:
          "Auth: Clerk\nRoles: Prisma `User.role`\nBootstrap admin: `ADMIN_EMAILS` or `ADMIN_CLERK_USER_IDS`",
        openProductOps: "Open product operations",
        products: "Products",
        orders: "Orders",
        customers: "Customers",
        catalogGroups: "Catalog groups",
        productsNote: "{count} active",
        ordersNote: "{count} in progress",
        customersNote: "{count} admins",
        catalogNote: "{count} brands",
        catalogActivity: "Catalog activity",
        recentlyUpdatedProducts: "Recently updated products",
        sku: "SKU",
        notSet: "Not set",
        featured: "Featured",
        updated: "Updated",
        noProductsYet:
          "No products yet. Once catalog items are added, they will appear here automatically.",
        orderDesk: "Order desk",
        latestOrderFlow: "Latest order flow",
        created: "Created",
        ordersAppearHere:
          "Orders will appear here as soon as checkout starts writing data.",
        customerAccess: "Customer access",
        recentUsersTitle: "Recent users synced from Clerk into Prisma",
        recentUsersCopy:
          "New authenticated users are created in the local `User` table on first access, then the admin check runs against `User.role`.",
        noEmailOnFile: "No email on file",
        active: "Active",
        disabled: "Disabled",
        joined: "Joined",
        unnamedUser: "Unnamed user",
        noSyncedUsers:
          "No synced users yet. After a user signs in with Clerk, they will appear here automatically.",
        adminUser: "Admin user",
      },
      productOps: {
        eyebrow: "Product operations",
        title: "Manage products, categories, and spreadsheet imports.",
        copy: "This workspace handles real create, edit, delete, and Excel import flows against your Prisma schema, including brand and category linking.",
        addProduct: "Add Product",
        downloadTemplate: "Download Template",
        allProducts: "All products",
        active: "Active",
        draft: "Draft",
        archived: "Archived",
        searchProducts: "Search products",
        searchPlaceholder: "name, slug, or SKU",
        statusFilter: "Status filter",
        allStatuses: "All statuses",
        filter: "Filter",
        productCol: "Product",
        organizationCol: "Organization",
        statusCol: "Status",
        metadataCol: "Metadata",
        actionsCol: "Actions",
        brand: "Brand",
        noBrand: "No brand",
        primaryCategory: "Primary category",
        none: "None",
        categoryLinks: "Category links",
        variants: "Variants",
        published: "Published",
        notPublished: "Not published",
        edit: "Edit",
        noMatch: "No products matched the current filter.",
        featured: "Featured",
        newBadge: "New",
        spreadsheetImport: "Spreadsheet import",
        importTitle: "Connect an Excel sheet to your catalog workflow",
        importCopy:
          "Upload `.xlsx`, `.xls`, or `.csv`. The importer will create or update products by `sku` first, then by `slug`, and will also match or create brands and categories by name.",
        workbookFile: "Workbook file",
        howItWorks: "How it works:",
        importHint1:
          "Use a sheet named `Products`, or let the importer read the first sheet in the workbook.",
        importHint2:
          "If the `sku` already exists, that row updates the product. If there is no `sku` match, the importer tries `slug`. If neither matches, it creates a new product.",
        importHint3:
          "Category lists can be separated with `|`, commas, or new lines. Image rows should use `url | alt text`.",
        importHint4:
          "Sheets with Mongolian headers like `Бараа нэр`, `Ангилал`, `Хэмжээ`, and `Тайлбар` are also supported.",
        supportedColumns: "Supported columns:",
        supportedColumnsList:
          "`name`, `sku`, `slug`, `status`, `brand`, `primaryCategory`, `categories`, `shortDescription`, `description`, `currency`, `baseUnit`, `trackInventory`, `allowBackorder`, `isFeatured`, `isNewArrival`, `seoTitle`, `seoDescription`, `publishedAt`, `images`",
        importSheet: "Import Sheet",
        importing: "Importing...",
        downloadTemplateBtn: "Download template",
      },
      productForm: {
        backToProducts: "Back to products",
        newPageTitle: "Add a new product",
        newPageCopy:
          "Create the core product record first. Variants, specifications, and imagery can grow from this base cleanly.",
        editPageCopy:
          "Update the core product record, category links, and merchandising flags without touching the landing page work.",
        createProduct: "Create Product",
        creating: "Creating...",
        saveChanges: "Save Changes",
        saving: "Saving...",
        editorEyebrow: "Product editor",
        productName: "Product name",
        slug: "Slug",
        slugPlaceholder: "leave blank to generate from name",
        sku: "SKU",
        currency: "Currency",
        status: "Status",
        baseUnit: "Base unit",
        shortDescription: "Short description",
        fullDescription: "Full description",
        brand: "Brand",
        noBrandSelected: "No brand selected",
        newBrandName: "New brand name",
        newBrandPlaceholder: "optional: create or match a brand by name",
        primaryCategory: "Primary category",
        noPrimaryCategory: "No primary category",
        categorySelection: "Category selection",
        noCategoriesHint:
          "No categories exist yet. You can still create some below with comma-separated names.",
        newCategories: "New categories",
        newCategoriesPlaceholder: "e.g. Tile, Bathroom, Electrical",
        productImageEntries: "Product image entries",
        imageEntriesPlaceholder:
          "https://example.com/chair-front.jpg | Front view\nhttps://example.com/chair-side.jpg | Side view",
        imageGuide: "Image guide",
        imageGuideCopy1:
          "Add one line per image. Use the format `image-url | alt text`. The first valid line becomes the main catalog image.",
        imageGuideCopy2:
          "This setup keeps things simple for now: no storage config, just image URLs you can manage quickly while building the catalog.",
        currentImagePreview: "Current image preview",
        primary: "Primary",
        imageN: "Image {n}",
        publishedAt: "Published at",
        trackInventory: "Track inventory",
        allowBackorder: "Allow backorder",
        featuredProduct: "Featured product",
        newArrival: "New arrival",
        seoTitle: "SEO title",
        seoDescription: "SEO description",
        inactive: "inactive",
      },
      deleteButton: {
        delete: "Delete Product",
        deleting: "Deleting...",
        confirmDelete: "Delete {name}? This cannot be undone.",
      },
      actions: {
        somethingWrong: "Something went wrong.",
        uploadFirst: "Upload an Excel or CSV file first.",
        created: "Created {name}.",
        updated: "Updated {name}.",
        deleted: "Deleted {name}.",
        importFinished:
          "Import finished: {created} created, {updated} updated, {skipped} skipped.",
        rowsFailed: "{count} row(s) failed. {first}",
      },
    },
    signInPage: {
      eyebrow: "Erka's account",
      title: "Sign in for saved orders, catalog access, and admin control.",
      copy: "Clerk handles authentication first, then Erka's syncs the account into the local Prisma `User` table for role checks and admin access.",
      feature1: "Secure sign-in",
      feature2: "Role-based admin",
      feature3: "Neon + Prisma",
      backToStorefront: "Back to storefront",
    },
    signUpPage: {
      eyebrow: "Erka's account",
      title: "Create an account for catalog access and project workflows.",
      copy: "New users are synced into Prisma on first access, and admin access is unlocked automatically when the account matches your bootstrap admin settings.",
      feature1: "Customer accounts",
      feature2: "Trade-ready roles",
      feature3: "Admin bootstrap",
      backToStorefront: "Back to storefront",
    },
    chat: {
      openLabel: "Open product assistant",
      closeLabel: "Close product assistant",
      title: "Product assistant",
      subtitle: "Finds products from the catalog",
      welcome:
        "Hi, I can help you choose the right products. Tell me what you are building or repairing, plus any measurements you have.",
      inputPlaceholder: "What are you working on?",
      sendLabel: "Send message",
      thinking: "Thinking...",
      fallbackError: "The assistant could not respond.",
      fallbackEmpty:
        "I could not find a clear answer yet. Could you share more detail?",
      messageLabel: "Message product assistant",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function formatString(
  template: string,
  vars: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = vars[key];
    return value === undefined || value === null ? `{${key}}` : String(value);
  });
}

export type { Dictionary };
