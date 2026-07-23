import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

const LanguageContext =
  createContext();

export default LanguageContext;

const translations = {
  vi: {
    common: {
      home: "Trang chủ",
      products: "Sản phẩm",
      categories: "Danh mục",
      orders: "Đơn hàng",
      dashboard: "Bảng điều khiển",
      profile: "Tài khoản",
      cart: "Giỏ hàng",
      login: "Đăng nhập",
      register: "Đăng ký",
      logout: "Đăng xuất",
      search: "Tìm kiếm",
      add: "Thêm",
      edit: "Chỉnh sửa",
      delete: "Xóa",
      save: "Lưu",
      cancel: "Hủy",
      close: "Đóng",
      refresh: "Làm mới",
      actions: "Thao tác",
      name: "Tên",
      description: "Mô tả",
      price: "Giá",
      stock: "Tồn kho",
      loading: "Đang tải...",
      noData: "Không có dữ liệu",
      darkMode: "Chế độ tối",
      lightMode: "Chế độ sáng",
      language: "Ngôn ngữ",
      vietnamese: "Tiếng Việt",
      english: "Tiếng Anh",
      backToHome: "Về trang chủ"
      ,email: "Email", password: "Mật khẩu", fullName: "Họ và tên",
      role: "Vai trò", phone: "Số điện thoại", address: "Địa chỉ",
      total: "Tổng cộng", remove: "Xóa", quantity: "Số lượng",
      product: "Sản phẩm", selectCategory: "Chọn danh mục",
      imageUrl: "Đường dẫn hình ảnh", create: "Tạo mới", update: "Cập nhật",
      noDescription: "Không có mô tả", uncategorized: "Chưa phân loại",
      wishlist: "Yêu thích"
    },

    admin: {
      administrator: "Quản trị viên",

      dashboardTitle: "Bảng điều khiển",
      dashboardDescription:
        "Tổng quan hoạt động cửa hàng",

      totalProducts: "Tổng sản phẩm",
      totalCategories: "Danh mục",
      totalOrders: "Đơn hàng",
      revenue: "Doanh thu",

      storeManagement:
        "Quản lý cửa hàng",

      quickAccess:
        "Truy cập nhanh các chức năng quản trị",

      productManagement:
        "Quản lý sản phẩm",

      productDescription:
        "Thêm, chỉnh sửa và kiểm soát sản phẩm",

      addProduct:
        "Thêm sản phẩm",

      editProduct:
        "Chỉnh sửa sản phẩm",

      productList:
        "Danh sách sản phẩm",

      searchProduct:
        "Tìm kiếm sản phẩm...",

      categoryManagement:
        "Quản lý danh mục",

      categoryDescription:
        "Tạo và tổ chức các nhóm sản phẩm",

      addCategory:
        "Thêm danh mục",

      editCategory:
        "Chỉnh sửa danh mục",

      categoryList:
        "Danh sách danh mục",

      searchCategory:
        "Tìm kiếm danh mục...",

      orderManagement:
        "Quản lý đơn hàng",

      orderDescription:
        "Theo dõi và cập nhật trạng thái đơn hàng",

      orderList:
        "Danh sách đơn hàng",

      searchOrder:
        "Tìm theo mã đơn, tên hoặc email...",

      orderCode: "Mã đơn",
      customer: "Khách hàng",
      total: "Tổng tiền",
      status: "Trạng thái",
      orderDate: "Ngày đặt",

      allStatuses:
        "Tất cả trạng thái",

      pending:
        "Chờ xác nhận",

      confirmed:
        "Đã xác nhận",

      shipping:
        "Đang giao",

      completed:
        "Hoàn thành",

      cancelled:
        "Đã hủy",
      unknown: "Không xác định",
      unknownCustomer: "Không rõ",
      viewDetails: "Xem chi tiết",
      openManagement: "Mở trang quản lý",
      loadingDashboard: "Đang tải dữ liệu...",
      loadingProducts: "Đang tải sản phẩm...",
      loadingCategories: "Đang tải danh mục...",
      loadingOrders: "Đang tải đơn hàng...",
      noProducts: "Không tìm thấy sản phẩm.",
      noCategories: "Không tìm thấy danh mục.",
      noOrders: "Không tìm thấy đơn hàng.",
      productCount: "{count} sản phẩm",
      categoryCount: "{count} danh mục",
      orderCount: "{count} đơn hàng",
      formDescription: "Điền đầy đủ thông tin sản phẩm.",
      confirmDeleteProduct: "Bạn có chắc muốn xóa sản phẩm này?",
      confirmDeleteCategory: "Bạn có chắc muốn xóa danh mục?",
      loadProductsError: "Không thể tải danh sách sản phẩm.",
      saveProductError: "Không thể lưu sản phẩm.",
      deleteProductError: "Không thể xóa sản phẩm.",
      loadCategoriesError: "Không thể tải danh mục.",
      saveCategoryError: "Không thể lưu danh mục.",
      deleteCategoryError: "Không thể xóa danh mục.",
      loadOrdersError: "Không thể tải danh sách đơn hàng.",
      updateOrderError: "Không thể cập nhật trạng thái đơn hàng."
    },

    user: {
      welcome:
        "Chào mừng đến với Woodora",

      featuredProducts:
        "Sản phẩm nổi bật",

      allProducts:
        "Tất cả sản phẩm",

      productDetail:
        "Chi tiết sản phẩm",

      addToCart:
        "Thêm vào giỏ hàng",

      checkout:
        "Thanh toán",

      myOrders:
        "Đơn hàng của tôi",

      emptyCart:
        "Giỏ hàng đang trống",
      heroTitle: "Nội thất vượt thời gian",
      heroDescription: "Nội thất cao cấp dành cho không gian sống hiện đại.",
      shopCollection: "Khám phá bộ sưu tập",
      noProducts: "Không tìm thấy sản phẩm.",
      discoverTitle: "Khám phá nội thất",
      searchProducts: "Tìm kiếm nội thất...",
      sortProducts: "Sắp xếp sản phẩm",
      priceLowHigh: "Giá thấp đến cao",
      priceHighLow: "Giá cao đến thấp",
      allCategories: "Tất cả danh mục",
      addedToCart: "Đã thêm vào giỏ hàng",
      shoppingCart: "Giỏ hàng",
      orderSummary: "Tóm tắt đơn hàng",
      placeOrder: "Đặt hàng",
      placingOrder: "Đang đặt hàng...",
      orderSuccess: "Đặt hàng thành công",
      cartEmptyError: "Giỏ hàng đang trống",
      noOrders: "Chưa có đơn hàng",
      order: "Đơn hàng",
      productsInOrder: "Sản phẩm",
      loginFailed: "Đăng nhập thất bại",
      emptyWishlist: "Chưa có sản phẩm yêu thích",
      emptyWishlistDescription: "Nhấn biểu tượng trái tim để lưu sản phẩm bạn yêu thích.",
      browseProducts: "Khám phá sản phẩm",
      addedToWishlist: "Đã thêm vào danh sách yêu thích",
      removedFromWishlist: "Đã xóa khỏi danh sách yêu thích",
      removeFromWishlist: "Xóa khỏi danh sách yêu thích"
      ,loginToWishlist: "Vui lòng đăng nhập để sử dụng danh sách yêu thích"
    }
  },

  en: {
    common: {
      home: "Home",
      products: "Products",
      categories: "Categories",
      orders: "Orders",
      dashboard: "Dashboard",
      profile: "Profile",
      cart: "Cart",
      login: "Login",
      register: "Register",
      logout: "Logout",
      search: "Search",
      add: "Add",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      refresh: "Refresh",
      actions: "Actions",
      name: "Name",
      description: "Description",
      price: "Price",
      stock: "Stock",
      loading: "Loading...",
      noData: "No data",
      darkMode: "Dark mode",
      lightMode: "Light mode",
      language: "Language",
      vietnamese: "Vietnamese",
      english: "English",
      backToHome: "Back to home"
      ,email: "Email", password: "Password", fullName: "Full name",
      role: "Role", phone: "Phone", address: "Address",
      total: "Total", remove: "Remove", quantity: "Quantity",
      product: "Product", selectCategory: "Select category",
      imageUrl: "Image URL", create: "Create", update: "Update",
      noDescription: "No description", uncategorized: "Uncategorized",
      wishlist: "Wishlist"
    },

    admin: {
      administrator: "Administrator",

      dashboardTitle: "Dashboard",
      dashboardDescription:
        "Store activity overview",

      totalProducts:
        "Total products",

      totalCategories:
        "Categories",

      totalOrders:
        "Orders",

      revenue:
        "Revenue",

      storeManagement:
        "Store management",

      quickAccess:
        "Quickly access administration features",

      productManagement:
        "Product management",

      productDescription:
        "Create, edit and manage products",

      addProduct:
        "Add product",

      editProduct:
        "Edit product",

      productList:
        "Product list",

      searchProduct:
        "Search products...",

      categoryManagement:
        "Category management",

      categoryDescription:
        "Create and organize product groups",

      addCategory:
        "Add category",

      editCategory:
        "Edit category",

      categoryList:
        "Category list",

      searchCategory:
        "Search categories...",

      orderManagement:
        "Order management",

      orderDescription:
        "Track and update order statuses",

      orderList:
        "Order list",

      searchOrder:
        "Search by order ID, name or email...",

      orderCode:
        "Order ID",

      customer:
        "Customer",

      total:
        "Total",

      status:
        "Status",

      orderDate:
        "Order date",

      allStatuses:
        "All statuses",

      pending:
        "Pending",

      confirmed:
        "Confirmed",

      shipping:
        "Shipping",

      completed:
        "Completed",

      cancelled:
        "Cancelled",
      unknown: "Unknown",
      unknownCustomer: "Unknown",
      viewDetails: "View details",
      openManagement: "Open management",
      loadingDashboard: "Loading dashboard...",
      loadingProducts: "Loading products...",
      loadingCategories: "Loading categories...",
      loadingOrders: "Loading orders...",
      noProducts: "No products found.",
      noCategories: "No categories found.",
      noOrders: "No orders found.",
      productCount: "{count} products",
      categoryCount: "{count} categories",
      orderCount: "{count} orders",
      formDescription: "Complete all product information.",
      confirmDeleteProduct: "Are you sure you want to delete this product?",
      confirmDeleteCategory: "Are you sure you want to delete this category?",
      loadProductsError: "Unable to load products.",
      saveProductError: "Unable to save the product.",
      deleteProductError: "Unable to delete the product.",
      loadCategoriesError: "Unable to load categories.",
      saveCategoryError: "Unable to save the category.",
      deleteCategoryError: "Unable to delete the category.",
      loadOrdersError: "Unable to load orders.",
      updateOrderError: "Unable to update the order status."
    },

    user: {
      welcome:
        "Welcome to Woodora",

      featuredProducts:
        "Featured products",

      allProducts:
        "All products",

      productDetail:
        "Product details",

      addToCart:
        "Add to cart",

      checkout:
        "Checkout",

      myOrders:
        "My orders",

      emptyCart:
        "Your cart is empty",
      heroTitle: "Timeless Furniture",
      heroDescription: "Premium furniture crafted for modern living spaces.",
      shopCollection: "Shop Collection",
      noProducts: "No products found.",
      discoverTitle: "Discover Furniture",
      searchProducts: "Search furniture...",
      sortProducts: "Sort products",
      priceLowHigh: "Price low to high",
      priceHighLow: "Price high to low",
      allCategories: "All categories",
      addedToCart: "Added to cart",
      shoppingCart: "Shopping cart",
      orderSummary: "Order summary",
      placeOrder: "Place order",
      placingOrder: "Placing order...",
      orderSuccess: "Order placed successfully",
      cartEmptyError: "Cart is empty",
      noOrders: "No orders found",
      order: "Order",
      productsInOrder: "Products",
      loginFailed: "Login failed",
      emptyWishlist: "Your wishlist is empty",
      emptyWishlistDescription: "Select the heart icon to save products you love.",
      browseProducts: "Browse products",
      addedToWishlist: "Added to wishlist",
      removedFromWishlist: "Removed from wishlist",
      removeFromWishlist: "Remove from wishlist"
      ,loginToWishlist: "Please log in to use your wishlist"
    }
  }
};

function getNestedValue(
  object,
  path
) {
  return path
    .split(".")
    .reduce(
      (current, key) =>
        current?.[key],
      object
    );
}

export function LanguageProvider({
  children
}) {
  const [
    language,
    setLanguageState
  ] = useState(() => {
    const savedLanguage =
      localStorage.getItem(
        "language"
      );

    return savedLanguage === "en"
      ? "en"
      : "vi";
  });

  useEffect(() => {
    document.documentElement.lang =
      language;
  }, [language]);

  const setLanguage =
    useCallback(
      (nextLanguage) => {
        if (
          nextLanguage !== "vi" &&
          nextLanguage !== "en"
        ) {
          return;
        }

        setLanguageState(
          nextLanguage
        );

        localStorage.setItem(
          "language",
          nextLanguage
        );
      },
      []
    );

  const toggleLanguage =
    useCallback(() => {
      setLanguage(
        language === "vi"
          ? "en"
          : "vi"
      );
    }, [
      language,
      setLanguage
    ]);

  const t = useCallback(
    (key, fallback = key) => {
      return (
        getNestedValue(
          translations[language],
          key
        ) ?? fallback
      );
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t
    }),
    [
      language,
      setLanguage,
      toggleLanguage,
      t
    ]
  );

  return (
    <LanguageContext.Provider
      value={value}
    >
      {children}
    </LanguageContext.Provider>
  );
}
