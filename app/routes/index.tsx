import {
  createBrowserRouter,
  LoaderFunctionArgs,
  Navigate,
  redirect,
} from "react-router-dom";
import { AppLayout } from "../layout/AppLayout.js";
import { BaseLayout } from "../layout/BaseLayout.js";
import { RootError } from "../layout/RootError.js";
import { config } from "@/core/config.js";
import { TokenType } from "@/core/enum.js";
import CustomerTable from "./customers/components/CustomerTable.js";
import EmployeeManagement from "./employee/index.js";
import CustomerProductTable from "./customers/components/CustomerProductTable.js";
import SubProductTableIntoCustomer from "./customers/components/sub-product-into-customer/SubProductTableIntoCustomer.js";
import Product from "./products/Product.js";
import SubProduct from "./sub-product/SubProduct.js";
import DiscountList from "./discount/components/DiscountList.js";
import ProductList from "./product-management/index.js";
import PricingGroupList from "./pricing-group/index.js";
import BillingNoteTable from "./billing-note/BillingNoteTable.js";
import BillingNoteMultiTable from "./billing-note-multi/BillingNoteMultiTable.js";
import BillingOneTime from "./billing-one-time/index.js";
import AccountDetails from "./settings/AccountDetails.js";
import SetupInvoice from "./setup-invoice/index.js";
import TaskManagement from "./task-management/index.js";
import Login from "./auth/Login.js";
import ActivityLog from "./activity-log/index.js";
import DirectApi from "./direct-api/index.js";

/**
 * Application routes
 * https://reactrouter.com/en/main/routers/create-browser-router
 */
export const router = createBrowserRouter([
  {
    path: "",
    element: <BaseLayout />,
    errorElement: <RootError />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      {
        path: "login",
        loader: protectedLoaderLogin,
        // lazy: () => import("./auth/Login.js"),
        element: <Login />,
      },
      // { path: "privacy", lazy: () => import("./legal/Privacy.js") },
      // { path: "terms", lazy: () => import("./legal/Terms.js") },
      // {
      //   path: "setting-password",
      //   lazy: () => import("./auth/components/SettingPassword.js"),
      // },
      // {
      //   path: "twofactor",
      //   lazy: () => import("./auth/components/TwoStepAuthentication.js"),
      // },
      // {
      //   path: "setup",
      //   lazy: () => import("./auth/components/SetUpAuthentication.js"),
      // },
    ],
  },
  {
    path: "",
    element: <AppLayout />,
    errorElement: <RootError />,
    children: [
      { index: true, element: <Navigate to="/customer" replace /> },
      // {
      //   path: "dashboard",
      //   loader: protectedLoader,
      //   lazy: () => import("./dashboard/Dashboard.js"),
      // },
      {
        path: "*",
        loader: protectedLoader,
        element: <Navigate to="/customer" replace />,
      },
      {
        path: "customer",
        loader: protectedLoader,
        // lazy: () => import("./customers/components/CustomerTable.js"),
        element: <CustomerTable />,
      },
      {
        path: "employee",
        loader: protectedLoader,
        // lazy: () => import("./customers/components/CustomerTable.js"),
        element: <EmployeeManagement />,
      },
      {
        path: "activity-log",
        loader: protectedLoader,
        // lazy: () => import("./customers/components/CustomerTable.js"),
        element: <ActivityLog />,
      },
      {
        path: "customer/:name",
        loader: protectedLoader,
        // lazy: () => import("./customers/components/CustomerProductTable.js"),
        element: <CustomerProductTable />,
      },
      {
        path: "customer/:name/:product",
        loader: protectedLoader,
        // lazy: () => import("./customers/components/sub-product-into-customer/SubProductTableIntoCustomer.js"),
        element: <SubProductTableIntoCustomer />,
      },
      {
        path: "products",
        loader: protectedLoader,
        // lazy: () => import("./products/Product.js"),
        element: <Product />,
      },
      {
        path: "products/sub-product",
        loader: protectedLoader,
        // lazy: () => import("./sub-product/SubProduct.js"),
        element: <SubProduct />,
      },
      {
        path: "discount",
        loader: protectedLoader,
        // lazy: () => import("./discount/components/DiscountList.js"),
        element: <DiscountList />,
      },
      // {
      //   path: "invoice",
      //   loader: protectedLoader,
      //   lazy: () => import("./invoice/Invoice.js"),
      // },
      // {
      //   path: "invoice-details/:username",
      //   loader: protectedLoader,
      //   lazy: () => import("./invoice/InvoiceDetails.js"),
      // },
      {
        path: "product-management",
        loader: protectedLoader,
        // lazy: () => import("./product-management/index.js"),
        element: <ProductList />,
      },
      {
        path: "pricing-group",
        loader: protectedLoader,
        // lazy: () => import("./pricing-group/index.js"),
        element: <PricingGroupList />,
      },
      {
        path: "billing-note",
        loader: protectedLoader,
        // lazy: () => import("./billing-note/BillingNoteTable.js"),
        element: <BillingNoteTable />
      },
      // {
      //   path: "billing-note-multi",
      //   loader: protectedLoader,
      //   // lazy: () => import("./billing-note-multi/BillingNoteMultiTable.js"),
      //   element: <BillingNoteMultiTable />
      // },
      {
        path: "one-time-billing",
        loader: protectedLoader,
        // lazy: () => import("./billing-one-time/index.js"),
        element: <BillingOneTime />
      },
      {
        path: "settings",
        lazy: () => import("./settings/SettingsLayout.js"),
        children: [
          { index: true, element: <Navigate to="/settings/account" /> },
          {
            path: "account",
            // lazy: () => import("./settings/AccountDetails.js"),
            element: <AccountDetails />,
          },
        ],
      },
      {
        path: "setup-invoice",
        loader: protectedLoader,
        // lazy: () => import("./setup-invoice/index.js"),
        element: <SetupInvoice />
      },
      // {
      //   path: "member",
      //   loader: protectedLoader,
      //   lazy: () => import("./member/MemeberMangement.js"),
      // },
      {
        path: "task-management",
        loader: protectedLoader,
        // lazy: () => import("./task-management/index.js"),
        element: <TaskManagement />
      },
      {
        path: "direct-api",
        loader: protectedLoader,
        // lazy: () => import("./product-management/index.js"),
        element: <DirectApi />,
      },
    ],
  },
]);
function protectedLoader({ request }: LoaderFunctionArgs) {

  if (getCookie(TokenType.AuthToken) === undefined) {
    return redirect("/login");
  }

  return null;
}

function protectedLoaderLogin({ request }: LoaderFunctionArgs) {
  if (getCookie(TokenType.AuthToken) && request.url.includes("/login")) {
    return redirect("/customer");
  }

  return null;
}

function getCookie(cName: any) {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie); //to be careful
  const cArr = cDecoded.split("; ");
  let res;
  cArr.forEach((val) => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  });
  return res;
}
// Clean up on module reload (HMR)
// https://vitejs.dev/guide/api-hmr
if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
