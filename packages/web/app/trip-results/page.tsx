"use client"

import { Calendar } from "@/components/ui/calendar"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Compass, ArrowLeft, Star, Zap, Globe, Users, Heart, Download, Share2 } from "lucide-react"
import Link from "next/link"

export default function TripResultsPage() {
  const [tripData] = useState({
    destination: "ベトナム北部",
    duration: "7日間",
    chaosLevel: 4,
    totalSpots: 15,
    hiddenSpots: 12,
    localRating: 4.7,
  })

  const [hiddenSpots] = useState([
    {
      id: 1,
      name: "Quán Cơm Bà Năm",
      type: "レストラン",
      description: "地元の家族が3代続けている小さな食堂。観光客は皆無だが、現地の人々に愛され続けている。",
      localRating: 4.9,
      reviewsCount: 127,
      language: "ベトナム語のみ",
      priceRange: "¥500-800",
      speciality: "伝統的な北部料理",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "Thác Bản Giốc ẩn",
      type: "自然スポット",
      description: "有名なバンゾック滝の近くにある、現地人だけが知る秘密の滝。絶景だが道のりは険しい。",
      localRating: 4.8,
      reviewsCount: 43,
      language: "現地ガイド必須",
      priceRange: "無料",
      speciality: "秘境の滝",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "Chợ Đêm Cũ",
      type: "市場",
      description: "観光地化されていない昔ながらの夜市。現地の人々の生活を垣間見ることができる。",
      localRating: 4.6,
      reviewsCount: 89,
      language: "ベトナム語のみ",
      priceRange: "¥200-1000",
      speciality: "ローカル夜市",
      image: "/placeholder.svg?height=200&width=300",
    },
  ])

  const [itinerary] = useState([
    {
      day: 1,
      title: "到着・現地の暮らしに触れる",
      activities: [
        { time: "14:00", activity: "ハノイ空港到着", type: "移動" },
        { time: "16:00", activity: "Quán Cơm Bà Năm で遅めの昼食", type: "食事" },
        { time: "18:00", activity: "旧市街の隠れた路地散策", type: "探索" },
        { time: "20:00", activity: "Chợ Đêm Cũ（現地夜市）", type: "体験" },
      ],
    },
    {
      day: 2,
      title: "秘境への冒険",
      activities: [
        { time: "06:00", activity: "早朝出発 - バンゾック方面へ", type: "移動" },
        { time: "10:00", activity: "現地ガイドと合流", type: "準備" },
        { time: "11:00", activity: "Thác Bản Giốc ẩn トレッキング", type: "冒険" },
        { time: "15:00", activity: "秘密の滝で休憩・撮影", type: "体験" },
      ],
    },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/create-trip" className="flex items-center text-orange-600 hover:text-orange-700">
              <ArrowLeft className="h-5 w-5 mr-2" />
              計画に戻る
            </Link>
            <div className="flex items-center space-x-2">
              <Compass className="h-6 w-6 text-orange-600" />
              <span className="text-xl font-bold text-gray-900">あなたの冒険プラン</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              共有
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              保存
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Trip Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{tripData.destination}の隠れ名所発見完了！</h1>
              <p className="text-gray-600">AIが厳選した{tripData.hiddenSpots}箇所の真の隠れ名所をご用意しました</p>
            </div>
            <div className="text-right">
              <Badge className="bg-orange-100 text-orange-800 text-lg px-4 py-2">
                カオス度: {tripData.chaosLevel}/5
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">{tripData.totalSpots}</div>
                <div className="text-sm text-gray-600">総スポット数</div>
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">{tripData.hiddenSpots}</div>
                <div className="text-sm text-gray-600">隠れ名所</div>
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">{tripData.localRating}</div>
                <div className="text-sm text-gray-600">現地評価平均</div>
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">0%</div>
                <div className="text-sm text-gray-600">観光地化率</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="spots" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="spots">隠れ名所</TabsTrigger>
            <TabsTrigger value="itinerary">旅程表</TabsTrigger>
            <TabsTrigger value="tips">現地情報</TabsTrigger>
          </TabsList>

          {/* Hidden Spots Tab */}
          <TabsContent value="spots" className="space-y-6">
            <div className="grid gap-6">
              {hiddenSpots.map((spot) => (
                <Card key={spot.id} className="border-orange-200 overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={spot.image || "/placeholder.svg"}
                        alt={spot.name}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{spot.name}</h3>
                          <Badge variant="outline" className="border-orange-200 text-orange-700">
                            {spot.type}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-orange-600 mb-1">
                            <Star className="h-4 w-4 mr-1 fill-current" />
                            <span className="font-bold">{spot.localRating}</span>
                          </div>
                          <div className="text-sm text-gray-500">{spot.reviewsCount}件のレビュー</div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{spot.description}</p>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-orange-600" />
                          <span>{spot.language}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">価格帯:</span>
                          <span>{spot.priceRange}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-2 text-orange-600" />
                          <span>{spot.speciality}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary" className="space-y-6">
            {itinerary.map((day) => (
              <Card key={day.day} className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                    Day {day.day}: {day.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {day.activities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 border border-orange-100 rounded-lg">
                        <div className="text-sm font-medium text-orange-600 w-16">{activity.time}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{activity.activity}</div>
                        </div>
                        <Badge variant="outline" className="border-orange-200 text-orange-700">
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Tips Tab */}
          <TabsContent value="tips" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-orange-600" />
                    基本フレーズ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">こんにちは</span>
                    <span className="text-gray-600">Xin chào</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">ありがとう</span>
                    <span className="text-gray-600">Cảm ơn</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">いくらですか？</span>
                    <span className="text-gray-600">Bao nhiêu tiền?</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">美味しい</span>
                    <span className="text-gray-600">Ngon</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-orange-600" />
                    冒険のコツ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>• 現地の人の真似をして注文する</div>
                  <div>• 翻訳アプリを準備しておく</div>
                  <div>• 笑顔とジェスチャーで乗り切る</div>
                  <div>• 予期しない状況を楽しむ心構え</div>
                  <div>• 緊急連絡先を控えておく</div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-orange-600" />
                    緊急時サポート
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium mb-2">現地緊急連絡先</div>
                    <div>警察: 113</div>
                    <div>救急: 115</div>
                    <div>消防: 114</div>
                  </div>
                  <div>
                    <div className="font-medium mb-2">日本領事館</div>
                    <div>ハノイ総領事館</div>
                    <div>+84-24-3846-3000</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
            <Download className="mr-2 h-5 w-5" />
            旅程をダウンロード
          </Button>
          <Link href="/create-trip">
            <Button size="lg" variant="outline" className="border-orange-200 hover:bg-orange-50 bg-transparent">
              <Compass className="mr-2 h-5 w-5" />
              新しい冒険を計画
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
