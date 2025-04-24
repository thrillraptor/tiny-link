"use client";
import { Copy, Send } from "lucide-react";
import { shortenUrl } from "./action";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Toast from "../components/ToastNotification";
import ToastContainerComponent from "../components/ui/ToastContainerComponent";

export default function Shorten() {
  const [shortenedUrl, setShortenedUrl] = useState<string>("");
  const schema = yup.object().shape({
    url: yup.string().url("Invalid URL address").required("URL is required"),
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { url: string }) => {
    try {
      await shortenUrl(data).then((response) => {
        Toast("success", "URL successfully shortened.");
        setShortenedUrl(response.shorten);
        setValue("url", "");
      });
    } catch (error) {
      console.error(error);
      Toast("error", "Failed to shorten URL. Please try again later.");
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (text) {
        await navigator.clipboard.writeText(text).then(() => {
          Toast("success", "URL copied to clipboard.");
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section className="absolute inset-0 flex items-center justify-center p-3 md:p-0 bg-[#121212] text-[#E2E2E2]">
      <div className="flex flex-col w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-2">Snip Snap</h1>
        <p className="text-lg font-medium text-[#9E9E9E] mb-6">
          Turn unwieldy URLs into crisp, shareable links in a single click.
        </p>
        <form
          action=""
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-6"
        >
          <div className="flex flex-col">
            <label htmlFor="original" className="text-sm font-medium mb-3">
              Paste Your URL
            </label>
            <div className="flex items-center border border-[#616161] bg-[#212121] px-4 py-2 rounded-xl">
              <input
                type="text"
                placeholder="Original URL here"
                className="focus:outline-none w-full appearance-none lowercase"
                {...register("url")}
              />
              <button type="submit" className="ml-4 hover:cursor-pointer">
                <Send className="w-5 h-5" />
              </button>
            </div>
            {errors.url && (
              <span className="text-red-500 text-sm font-semibold mt-3">
                {errors.url.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="shorten" className="text-sm font-medium mb-3">
              Voilà—Your Short Link
            </label>
            <div className="flex items-center border border-[#616161] bg-[#212121] px-4 py-2 rounded-xl">
              <input
                type="text"
                readOnly
                value={shortenedUrl}
                placeholder="Your short link appears here"
                className="focus:outline-none w-full appearance-none lowercase"
              />
              <button
                type="button"
                className="ml-4 hover:cursor-pointer"
                onClick={() => copyToClipboard(shortenedUrl)}
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainerComponent />
    </section>
  );
}
