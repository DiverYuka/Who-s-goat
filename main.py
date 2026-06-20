# NBA 球員榮譽評分系統
# 使用者可調整各項榮譽的加權來排名球員
# 數據從 CSV 文件讀取（可由爬蟲更新）

import pandas as pd
import json
import os
from datetime import datetime

class NBAHonorsRanker:
    """NBA 球員榮譽排名系統"""
    
    # 默認的加權設定
    DEFAULT_WEIGHTS = {
        'championship': 10.0,
        'fmvp': 8.0,
        'mvp': 9.0,
        'allNBAFirst': 7.0,
        'allNBASecond': 5.0,
        'allNBAThird': 3.0,
        'allDefenseFirst': 5.0,
        'allDefenseSecond': 3.0,
        'allStar': 2.0,
        'scoringTitle': 4.0,
        'assistTitle': 4.0,
        'reboundTitle': 4.0,
        'dpoy': 8.0,
        'roty': 3.0,
        'sixthMan': 2.0
    }
    
    # 榮譽項目的中文標籤
    LABELS = {
        'championship': '總冠軍',
        'fmvp': '總決賽MVP',
        'mvp': 'MVP',
        'allNBAFirst': 'All-NBA一隊',
        'allNBASecond': 'All-NBA二隊',
        'allNBAThird': 'All-NBA三隊',
        'allDefenseFirst': '最佳防守一隊',
        'allDefenseSecond': '最佳防守二隊',
        'allStar': '全明星',
        'scoringTitle': '得分王',
        'assistTitle': '助攻王',
        'reboundTitle': '籃板王',
        'dpoy': '最佳防守球員',
        'roty': '年度新人',
        'sixthMan': '最佳第六人'
    }
    
    def __init__(self, csv_file='nba_players_honors.csv', weights_file='weights.json'):
        self.csv_file = csv_file
        self.weights_file = weights_file
        self.df = None
        self.weights = self.DEFAULT_WEIGHTS.copy()
        self.load_data()
        self.load_weights()
    
    def load_data(self):
        """從 CSV 文件加載數據"""
        try:
            self.df = pd.read_csv(self.csv_file)
            print(f"✓ 成功加載 {len(self.df)} 位球員的數據")
            return True
        except FileNotFoundError:
            print(f"✗ 找不到數據文件: {self.csv_file}")
            return False
    
    def load_weights(self):
        """從文件加載自訂加權，若無則使用默認"""
        if os.path.exists(self.weights_file):
            try:
                with open(self.weights_file, 'r', encoding='utf-8') as f:
                    custom_weights = json.load(f)
                self.weights.update(custom_weights)
                print(f"✓ 成功加載自訂加權")
            except Exception as e:
                print(f"⚠ 加載自訂加權失敗，使用默認: {e}")
        else:
            self.save_weights()
    
    def save_weights(self):
        """保存當前加權設定"""
        try:
            with open(self.weights_file, 'w', encoding='utf-8') as f:
                json.dump(self.weights, f, ensure_ascii=False, indent=2)
            print(f"✓ 加權設定已保存至 {self.weights_file}")
        except Exception as e:
            print(f"✗ 保存加權設定失敗: {e}")
    
    def calculate_score(self, player_row):
        """計算單一球員的總分"""
        score = 0
        for honor, weight in self.weights.items():
            if honor in player_row.index:
                count = player_row[honor]
                score += count * weight
        return score
    
    def get_top_players(self, top_n=10):
        """計算並返回前N名球員"""
        if self.df is None:
            print("✗ 尚未加載數據")
            return None
        
        # 計算每位球員的總分
        scores = self.df.apply(self.calculate_score, axis=1)
        self.df['score'] = scores
        
        # 排序並取前N名
        top_players = self.df.nlargest(top_n, 'score').copy()
        return top_players
    
    def display_top_players(self, top_n=10):
        """顯示前N名球員及詳細分數"""
        top_players = self.get_top_players(top_n)
        
        if top_players is None or len(top_players) == 0:
            return
        
        print("\n" + "="*80)
        print(f"NBA 球員榮譽排名 (前{top_n}名)")
        print(f"生成時間: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*80 + "\n")
        
        # 顯示加權設定摘要
        print("【目前加權設定】")
        for honor, weight in sorted(self.weights.items(), key=lambda x: x[1], reverse=True):
            label = self.LABELS.get(honor, honor)
            print(f"  {label:15} : {weight:6.1f}")
        print()
        
        # 顯示排名
        print("【排名結果】\n")
        for idx, (i, player) in enumerate(top_players.iterrows(), 1):
            print(f"{idx:2}. {player['name']:20} 總分: {player['score']:8.1f}")
            
            # 顯示詳細榮譽數據
            details = []
            for honor, weight in self.weights.items():
                if honor in player.index and player[honor] > 0:
                    count = int(player[honor])
                    label = self.LABELS.get(honor, honor)
                    contribution = count * weight
                    details.append(f"{label}×{count}({contribution:.0f})")
            
            if details:
                print(f"    └─ " + ", ".join(details[:3]))
                if len(details) > 3:
                    print(f"       " + ", ".join(details[3:]))
            print()
        
        print("="*80)
    
    def show_weights_menu(self):
        """顯示加權調整菜單"""
        while True:
            print("\n【加權設定菜單】\n")
            print("0. 返回主菜單")
            print("1. 查看當前加權")
            print("2. 調整單個加權")
            print("3. 重置為默認加權")
            print("4. 導入自訂加權文件")
            print("5. 導出當前加權")
            
            choice = input("\n請選擇 (0-5): ").strip()
            
            if choice == '0':
                break
            elif choice == '1':
                self.display_weights()
            elif choice == '2':
                self.adjust_single_weight()
            elif choice == '3':
                self.reset_weights()
            elif choice == '4':
                self.import_weights()
            elif choice == '5':
                self.export_weights()
            else:
                print("✗ 無效選擇")
    
    def display_weights(self):
        """顯示所有加權"""
        print("\n【當前加權設定】\n")
        for honor, weight in sorted(self.weights.items(), key=lambda x: x[1], reverse=True):
            label = self.LABELS.get(honor, honor)
            print(f"  {label:15} : {weight:6.1f}")
    
    def adjust_single_weight(self):
        """調整單個加權"""
        print("\n【調整加權】\n")
        
        # 顯示可調整的項目
        for idx, (honor, weight) in enumerate(sorted(self.weights.items(), key=lambda x: x[1], reverse=True), 1):
            label = self.LABELS.get(honor, honor)
            print(f"{idx:2}. {label:15} (目前: {weight:6.1f})")
        
        try:
            choice = int(input("\n選擇項目編號: ")) - 1
            honors_list = sorted(self.weights.items(), key=lambda x: x[1], reverse=True)
            
            if 0 <= choice < len(honors_list):
                honor_key = honors_list[choice][0]
                label = self.LABELS.get(honor_key, honor_key)
                new_weight = float(input(f"輸入 {label} 的新加權值: "))
                
                old_weight = self.weights[honor_key]
                self.weights[honor_key] = new_weight
                self.save_weights()
                print(f"✓ {label}: {old_weight} → {new_weight}")
            else:
                print("✗ 無效選擇")
        except ValueError:
            print("✗ 輸入無效")
    
    def reset_weights(self):
        """重置為默認加權"""
        confirm = input("\n確認重置為默認加權? (y/n): ").lower()
        if confirm == 'y':
            self.weights = self.DEFAULT_WEIGHTS.copy()
            self.save_weights()
            print("✓ 已重置為默認加權")
    
    def import_weights(self):
        """從自訂文件導入加權"""
        try:
            filename = input("\n輸入加權文件名 (預設: weights_custom.json): ").strip()
            if not filename:
                filename = "weights_custom.json"
            
            with open(filename, 'r', encoding='utf-8') as f:
                custom_weights = json.load(f)
            
            self.weights.update(custom_weights)
            self.save_weights()
            print(f"✓ 已從 {filename} 導入加權")
        except FileNotFoundError:
            print(f"✗ 找不到文件: {filename}")
        except json.JSONDecodeError:
            print("✗ 文件格式無效")
    
    def export_weights(self):
        """導出當前加權到文件"""
        try:
            filename = input("\n輸入導出文件名 (預設: weights_custom.json): ").strip()
            if not filename:
                filename = "weights_custom.json"
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(self.weights, f, ensure_ascii=False, indent=2)
            print(f"✓ 已導出加權到 {filename}")
        except Exception as e:
            print(f"✗ 導出失敗: {e}")
    
    def show_main_menu(self):
        """顯示主菜單"""
        while True:
            print("\n" + "="*50)
            print("NBA 球員榮譽評分系統")
            print("="*50)
            print("\n0. 退出")
            print("1. 查看前10名球員")
            print("2. 查看前20名球員")
            print("3. 自訂排名人數")
            print("4. 加權設定菜單")
            print("5. 刷新數據")
            
            choice = input("\n請選擇 (0-5): ").strip()
            
            if choice == '0':
                print("\n感謝使用！")
                break
            elif choice == '1':
                self.display_top_players(10)
            elif choice == '2':
                self.display_top_players(20)
            elif choice == '3':
                try:
                    n = int(input("\n顯示前N名 (1-100): "))
                    if 1 <= n <= 100:
                        self.display_top_players(n)
                    else:
                        print("✗ 請輸入 1-100 之間的數字")
                except ValueError:
                    print("✗ 無效輸入")
            elif choice == '4':
                self.show_weights_menu()
            elif choice == '5':
                print("\n重新加載數據...")
                self.load_data()
                self.load_weights()
            else:
                print("✗ 無效選擇")


def main():
    """主程式"""
    ranker = NBAHonorsRanker()
    
    if ranker.df is None:
        print("\n✗ 無法啟動程式，請檢查 nba_players_honors.csv 文件")
        return
    
    ranker.show_main_menu()


if __name__ == "__main__":
    main()
"""顯示榮譽最多的前 N 位球員"""
    if not self.all_players_data:
        print("沒有數據可以顯示！")
        return
        
    print(f"\n榮譽最多的前 {top_n} 位球員:")
    print("=" * 80)
        
    for i, player in enumerate(self.all_players_data[:top_n], 1):
        total = sum(player[key] for key in player if key not in ['name', 'player_id'])
        print(f"{i}. {player['name']:<25} - 總榮譽數: {total}")
        print(f"   冠軍:{player['championship']} MVP:{player['mvp']} FMVP:{player['fmvp']} " +f"全明星:{player['allStar']} 年度隊:{player['allNBAFirst']+player['allNBASecond']+player['allNBAThird']}")


# 使用範例
if __name__ == "__main__":
    scraper = NBAAwardsScraper()
    
    # 選項 1: 測試模式 - 只抓取前 20 位球員
    print("開始測試模式（前 20 位球員）...")
    scraper.scrape_all_players(limit=20)
    
    # 選項 2: 完整模式 - 抓取所有球員（需要很長時間！）
    # print("開始完整抓取（所有球員）...")
    # scraper.scrape_all_players()
    
    # 顯示結果
    scraper.print_top_players(20)
    
    # 保存為 CSV
    scraper.save_to_csv('nba_players_honors.csv')
    
    print("\n完成！你現在可以用這個 CSV 檔案匯入到評分系統中。")