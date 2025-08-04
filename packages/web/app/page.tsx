import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Globe, MapPin, Compass, Star, Users, Zap, Shield } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Compass className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold text-gray-900">OffPath</span>
          </div>
          <Link href="/auth">
            <Button className="bg-orange-600 hover:bg-orange-700">
              始める <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-orange-100 text-orange-800 border-orange-200">真の隠れ名所発見サービス</Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            誰も知らない
            <span className="text-orange-600 block">本物の旅</span>
            を見つけよう
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            母国語のレビューが存在しない「真の隠れ名所」だけを厳選。
            <br />
            現地人に愛される本物の体験を、予測不可能な旅程で提供します。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-3">
                冒険を始める <Compass className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 border-orange-200 hover:bg-orange-50 bg-transparent"
            >
              サービス詳細
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">こんな旅行の悩み、ありませんか？</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 border-red-200 bg-red-50/50">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold text-red-800 mb-3">「また同じような観光地巡り...」</h3>
                <p className="text-red-700">SNSで見たことある景色ばかり。有名観光地は一通り行き尽くした感がある。</p>
              </CardContent>
            </Card>
            <Card className="p-6 border-red-200 bg-red-50/50">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold text-red-800 mb-3">「本当に美味しい現地料理が食べたい」</h3>
                <p className="text-red-700">
                  日本語レビューがあるところしか行けない。現地人が本当に愛する場所が分からない。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">OffPathが解決します</h2>
            <p className="text-xl text-gray-600">現地語限定の情報解析で、真の隠れ名所だけを発見</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow border-orange-200">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">隠れ名所発見エンジン</h3>
                <p className="text-gray-600">現地語レビューを解析し、観光客がまだ知らない高評価スポットを発見</p>
              </CardContent>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow border-orange-200">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">カオス旅程ジェネレーター</h3>
                <p className="text-gray-600">予測不可能性を重視した、サプライズに満ちた旅程を自動生成</p>
              </CardContent>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow border-orange-200">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">現地サポートシステム</h3>
                <p className="text-gray-600">リアルタイム翻訳と緊急時サポートで、安心して冒険できる</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">カオスだけど最高な旅を設計</h2>
          <p className="text-xl mb-8 opacity-90">予測不可能で、刺激的で、でも間違いなく価値のある体験</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <Star className="h-6 w-6 mt-1 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold mb-2">真の現地体験</h3>
                <p className="opacity-90">観光客向けでない、現地人が本当に愛する場所での体験</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 mt-1 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold mb-2">独占的な体験</h3>
                <p className="opacity-90">同じ国の人がまだ誰も行ったことのない場所での優越感</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Zap className="h-6 w-6 mt-1 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold mb-2">予測不可能な刺激</h3>
                <p className="opacity-90">計画されすぎない、サプライズに満ちた旅程</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Users className="h-6 w-6 mt-1 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold mb-2">ストーリー性</h3>
                <p className="opacity-90">帰国後に語れる、ユニークで印象的な旅行体験</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            あなたの旅を、誰もが体験できない
            <br />
            特別なものに変えませんか？
          </h2>
          <p className="text-xl text-gray-600 mb-8">次の旅行こそは、誰も知らない場所で本物の体験を</p>
          <Link href="/auth">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-lg px-12 py-4">
              今すぐ冒険を始める <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Compass className="h-6 w-6 text-orange-400" />
            <span className="text-xl font-bold">OffPath</span>
          </div>
          <p className="text-gray-400 mb-4">真の隠れ名所で、本物の旅体験を</p>
          <p className="text-sm text-gray-500">© 2024 OffPath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
