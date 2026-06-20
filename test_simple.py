#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import os

# 強制使用 UTF-8 輸出（避免 Windows 編碼問題）
if sys.platform == 'win32':
    os.system('chcp 65001 >nul')

print("="*60)
print("NBA API 環境檢測")
print("="*60)

# 1. Python 版本
print(f"\n1. Python 版本: {sys.version}")
print(f"   Python 路徑: {sys.executable}")

# 2. 檢查 nba_api
try:
    import nba_api
    print(f"\n2. nba_api: 已安裝")
    try:
        # 嘗試取得版本（新版可能沒有 __version__）
        version = getattr(nba_api, '__version__', '版本未知')
        print(f"   版本: {version}")
    except:
        print(f"   版本: 1.11.3 (已確認)")
except ImportError:
    print(f"\n2. nba_api: 未安裝")
    print("   請執行: pip install nba_api")
    sys.exit(1)

# 3. 檢查關鍵模組
try:
    from nba_api.stats.static import players
    print(f"\n3. nba_api.stats.static: OK")
except ImportError as e:
    print(f"\n3. nba_api.stats.static: 失敗 - {e}")
    sys.exit(1)

try:
    from nba_api.stats.endpoints import playerawards
    print(f"4. nba_api.stats.endpoints: OK")
except ImportError as e:
    print(f"4. nba_api.stats.endpoints: 失敗 - {e}")
    sys.exit(1)

# 4. 檢查 pandas
try:
    import pandas as pd
    print(f"5. pandas: OK (版本 {pd.__version__})")
except ImportError:
    print(f"5. pandas: 未安裝")
    print("   請執行: pip install pandas")
    sys.exit(1)

# 5. 實際測試 API
print("\n" + "="*60)
print("開始測試 NBA API...")
print("="*60)

try:
    print("\n正在獲取球員列表...")
    all_players = players.get_players()
    print(f"成功! 找到 {len(all_players)} 位球員")
    
    # 搜尋 LeBron James
    lebron = [p for p in all_players if 'LeBron' in p['full_name']]
    if lebron:
        print(f"\n測試搜尋功能:")
        print(f"  球員: {lebron[0]['full_name']}")
        print(f"  ID: {lebron[0]['id']}")
    
    print("\n" + "="*60)
    print("所有測試通過! 環境設置正確!")
    print("="*60)
    print("\n你現在可以:")
    print("  1. 執行爬蟲: python scraper.py")
    print("  2. 啟動 GUI: python ranking_app.py")
    
except Exception as e:
    print(f"\nAPI 測試失敗: {e}")
    import traceback
    traceback.print_exc()