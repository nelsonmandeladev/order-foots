import {FlatList, Pressable, Text, View, Image, TouchableOpacity} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {images, offers} from "@/constants";
import {Fragment} from "react";
import cn from "clsx";
import {CartButton} from "@/components";

export default function Index() {
  return (
      <SafeAreaView className="flex-1 bg-white">
          <FlatList
              data={offers}
              renderItem={({item, index}) => {
                  const isEven = index % 2 === 0;
                  return (
                      <View>
                          <Pressable
                              className={cn("offer-card", {
                                  "flex-row-reverse": isEven,
                                  "flex-row": !isEven
                              })}
                              style={{backgroundColor: item.color}}
                              android_ripple={{color: "#fffff22"}}
                          >
                              {({pressed}) => (
                                  <Fragment>
                                      <View className={"h-full w-1/2"}>
                                          <Image source={item.image} className={'size-full'} resizeMode={"cover"} />
                                      </View>
                                      <View className={cn("offer-card__info", {
                                          "pl-10": isEven,
                                          "pr-10": !isEven
                                      })}>
                                            <Text className={"h1-bold text-white leading-tight"}>{item.title}</Text>
                                          <Image
                                              source={images.arrowRight}
                                              className={"size-10"}
                                              resizeMode={"contain"}
                                              tintColor={"#ffffff"}
                                          />
                                      </View>
                                  </Fragment>
                              )}
                          </Pressable>
                      </View>
                  )
              }}
              className={"pb-28 px-5"}
              ListHeaderComponent={() => (
                  <View className="flex-between flex-row w-full my-5">
                      <View className="flex-start">
                          <Text className={"small-bold text-primary"}>
                              DELIVER TO
                          </Text>
                          <TouchableOpacity className={"flex-center flex-row gap-x-1 mt-0.5"}>
                              <Text className={"paragraph-bold  text-dark-100"}>
                                  Cameroon
                              </Text>
                              <Image source={images.arrowDown} className={"size-3"} resizeMode={"contain"} />
                          </TouchableOpacity>
                      </View>
                      <CartButton />
                  </View>
              )}
          />
      </SafeAreaView>
  );
}
