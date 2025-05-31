import { Quote } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";

const TestimonialCard = ({
  name,
  username,
  image,
  text,
}: {
  name: string;
  username: string;
  image: string;
  text: string;
}) => {
  return (
    <Card className="mt-7 inline-block break-inside-avoid shadow-none rounded-2xl w-full border">
      <CardContent className="flex flex-col items-start gap-4 p-7">
        <div className="flex items-center gap-4 w-full">
          <div className="relative size-11">
            <Image src={image} alt="profile" height={50} width={50} />
          </div>
          <div>
            <p className="font-semibold  leading-none text-foreground text-lg">
              {name}
            </p>
            <p className="mt-1 leading-none text-muted-foreground">
              @{username}
            </p>
          </div>
        </div>
        <p className="text-foreground">
          <Quote className="inline-block mr-1 mb-[3px] h-4 w-5" />
          {text}
        </p>
      </CardContent>
    </Card>
  );
};

const Testimonials = () => {
  return (
    <section className="py-20 sm:px-6">
      <div className="container max-w-7xl mx-auto flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <span className="font-bold text-main">Testimonials</span>
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-center sm:text-5xl">
            What people say about us
          </h2>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <TestimonialCard
              key={index}
              image="/profile.png"
              name="John"
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec ultrices orci. Vivamus ante arcu, hendrerit bibendum felis a, volutpat feugiat tellus. Aliquam erat volutpat."
              username="johndoe"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
