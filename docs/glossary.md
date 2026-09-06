# 用語集

本プラグインの概念モデルと命名規則を定義する。製品名・プラグイン ID・コマンド ID・CSS クラス・ソース上の型名・識別子など、すべての名称に適用する。

Obsidian API の型（`TFile`, `TFolder` など）および `path` は前提知識とし、本用語集の定義対象外とする。

---

## 層と用語の対応

- UI / View 層（実装内）
  - Row, Column, Cell
- Domain 層
  - ユーザー向け: Note, Folder
  - 実装内: DateKey, NoteGroup
- Repository 層（Vault 物理表現）
  - ユーザー向け: Folder
  - 実装内: VaultNote


| 層          | 役割              | ユーザー向け       | 実装内のみ              |
| ---------- | --------------- | ------------ | ------------------ |
| UI / View  | 表の見た目・操作単位を扱う   | —            | Row, Column, Cell  |
| Domain     | 表に載せる論理概念を扱う    | Note, Folder | DateKey, NoteGroup |
| Repository | Vault 上の物理実体を扱う | Folder       | VaultNote          |


Folder は Domain と Repository の両方に現れる。意味は同一で、層ごとに責務だけが異なる。UI の Column は Folder の表上の表示である。

Domain の用語がすべてユーザー向けであるとは限らない。ユーザー向け文書・設定・製品名に出すのは Note / Folder（および「日付」などの平易な言い換え）に限る。

---



## 用語定義


| 用語                 | 層                   | 公開範囲   | 定義                                                                                                                                                                            |
| ------------------ | ------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Note（ノート）          | Domain              | ユーザー向け | 表に並ぶ 1 件。Vault 内の Markdown ノート 1 ファイルに対応する。日記・ログ・予定・完了済みメモなども含む。所属は親 Folder で決まる。コード例: `Note`, `NoteModel`, `listNotes()`                                                     |
| Folder（フォルダ）       | Domain / Repository | ユーザー向け | Vault 上の物理フォルダであり、表の横軸のグループでもある。対象フォルダ直下のサブフォルダが表に並ぶ。設定のパス指定でも用いる（`targetFolder` / `excludedFolders`）。文言は「フォルダ」「対象フォルダ」「除外フォルダ」。コード例: `Folder`, `folderPath`, `listFolders()` |
| DateKey（日付キー）      | Domain              | 実装内    | 表の縦軸を識別する日付。フロントマター `datetime` から得る。日付のないノートは `null` などの未設定値で表す。ユーザー向けには「日付」と呼ぶ。コード例: `DateKey`                                                                               |
| NoteGroup（ノートグループ） | Domain              | 実装内    | ある日付 × あるフォルダに属する Note の集合。グループ化キーは `groupKey` を用いる。ユーザー向けには型名を出さず、交点のノートとして説明する。コード例: `NoteGroup`, `noteGroups`, `groupedNotes`                                              |
| Row（行）             | UI                  | 実装内    | 表の縦軸の表示単位。1 つの DateKey に対応する。日付のないノートは表下部の行に集約する                                                                                                                              |
| Column（列）          | UI                  | 実装内    | 表の横軸の表示単位。1 つの Folder に対応する                                                                                                                                                   |
| Cell（セル）           | UI                  | 実装内    | 日付 × 列の交点を表す表示単位（HTML `<td>` に対応）。Domain では Cell を使わず、同じ交点のノート集合を NoteGroup と呼ぶ                                                                                               |
| VaultNote          | Repository          | 実装内    | Repository がファイルから読み取った生のノート表現。Domain の Note への変換前のデータ。例: `{ path, datetime, parentPath, title }`                                                                             |


---



## 命名の指針

1. **Repository** は Folder / VaultNote を使う。Obsidian API（`TFile`, `TFolder`, `path`）には忠実に従う。UI 用語（Row / Column / Cell）は持ち込まない
2. **Domain** は Note / Folder / DateKey / NoteGroup を使う。Column や Cell は持ち込まない。横軸の識別は Folder（または `folderPath`）で行い、列専用の型は持たない
3. **UI** は Row / Column / Cell を使う。Column は Folder の表示であり、Domain に Column を逆輸入しない
4. **ユーザー向け**（README・設定・製品名・コマンド名など）に出す語は Note / Folder に限る。DateKey / NoteGroup / Row / Column / Cell / VaultNote は実装内に留める。縦軸は「日付」と平易に書いてよい
5. 過度な抽象化を避ける。現状はフォルダ = 表の横軸の 1:1 なので、Folder をそのままグループキーとする

