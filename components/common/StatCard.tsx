import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

const themeData = {
  green: {
    primary: "#03BE84",
    background_light: "#D7EEE6",
    background_medium: "#ACE4D1",
    background_dark: "#7DDABD",
  },
  blue: {
    primary: "#39D3F2",
    background_light: "#CAE8EF",
    background_medium: "#B2E8F4",
    background_dark: "#85E0F3",
  },
  orange: {
    primary: "#FF895B",
    background_light: "#F6E7E2",
    background_medium: "#F9D5C7",
    background_dark: "#FAC0AA",
  },
  red: {
    primary: "#DC3646",
    background_light: "#F2DEE0",
    background_medium: "#EEBCC1",
    background_dark: "#E8979E",
  },
};

const StatCard = ({
  Icon,
  title,
  value,
  percentChange,
  positiveChange,
  theme,
}: {
  Icon: React.ElementType;
  title: string;
  value: string;
  percentChange: string;
  positiveChange: boolean;
  theme: "green" | "blue" | "orange" | "red";
}) => {
  const colors = themeData[theme];

  return (
    <Card
      style={{
        backgroundColor: colors.background_light,
        borderColor: colors.primary,
        borderWidth: "2px",
        overflow: "hidden",
        position: "relative",
      }}

      className="overflow-hidden relative py-4 px-0"
    >
      <CardContent className="pl-2 sm:pl-6">
        <div className="px-0 sm:px-2">
          <div className="relative">
            <div
              className="absolute -top-7 -left-8 w-24 h-24 p-3 rounded-full blur-lg"
              style={{
                background: `radial-gradient(circle, ${colors.background_medium}, ${colors.background_dark})`,
              }}
            />
            <div
              className="w-max p-2 rounded-full border-2 relative z-10"
              style={{
                backgroundColor: colors.background_light,
                borderColor: colors.primary,
              }}
            >
              <Icon size={16} style={{ color: colors.primary }} />
            </div>
          </div>
          <div className="relative z-10 mt-4 ">
            <p className="text-xs font-medium">{title}</p>
            <div className="flex items-end gap-3 justify-start">
              <h3 className="font-bold text-3xl">{value}</h3>
              <div className="flex items-center gap-1 pb-1">
                {positiveChange ? (
                  <TrendingUp
                    size={16}
                    className="text-green-600 font-bold"
                  />
                ) : (
                  <TrendingDown
                    size={16}
                    className="text-red-600 font-bold"
                  />
                )}
                <span
                  className={cn(
                    "font-bold text-xs",
                    positiveChange ? "text-green-600" : "text-red-600"
                  )}
                >
                  {percentChange}%
                </span>
              </div>
            </div>
          </div>

          <div
            className="w-32 h-32 rounded-full absolute -right-8 -bottom-10 z-[5]"
            style={{ backgroundColor: colors.background_dark }}
          />
          <div
            className="w-40 h-40 rounded-full absolute -right-10 -bottom-14 z-[4]"
            style={{ backgroundColor: colors.background_medium }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
