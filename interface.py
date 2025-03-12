import tkinter as tk
from tkinter import ttk

janela = tk.Tk()
janela.title("Caxeiro Viajante")
janela.state('zoomed')

# Criando os frames principais com ajuste de largura
frame_esquerda = tk.Frame(janela, width=400)
frame_esquerda.pack(side="left", fill="y")
frame_esquerda.pack_propagate(False)

frame_direita = tk.Frame(janela)
frame_direita.pack(side="right", expand=True, fill="both")

# ---- Área esquerda (Inputs e Botão) ----
frame_inputs = tk.Frame(frame_esquerda)
frame_inputs.pack(pady=20, padx=20)

# Campos de entrada
tk.Label(frame_inputs, text="Início", font=("Arial", 12, "bold")).grid(row=0, column=0, columnspan=2, pady=10)

entry_Inicio = tk.Entry(frame_inputs)
entry_Inicio.grid(row=1, column=1, pady=5)

tk.Label(frame_inputs, text="Objetivo", font=("Arial", 12, "bold")).grid(row=3, column=0, columnspan=2, pady=10)

entry_Objetivo = tk.Entry(frame_inputs)
entry_Objetivo.grid(row=4, column=1, pady=5)

# Dropdown
tk.Label(frame_inputs, text="Métodos:", font=("Arial", 12, "bold")).grid(row=6, column=0, columnspan=2, pady=10)
opcoes = ["", "Amplitude", "Profundidade Limitada", "Aprofundamento Iterativo", "Bidirecional", "Custo Uniforme", "Greedy"]
dropdown = ttk.Combobox(frame_inputs, value=opcoes)
dropdown.grid(row=7, column=0, columnspan=2, pady=5)
dropdown.current(0)

# Botão
btn_Executar = tk.Button(frame_esquerda, text="Executar", command=lambda: print("Botão clicado"))
btn_Executar.pack(pady=20)

# ---- Área direita (Grid e Texto) ----
frame_grid = tk.Frame(frame_direita, bg="white", width=600, height=400)
frame_grid.pack(expand=True, fill="both", padx=20, pady=20)
tk.Label(frame_grid, text="Área do grafo (futuro)", fg="gray", font=("Arial", 14)).place(relx=0.5, rely=0.5, anchor="center")

# Campo de resultado
label_resultado = tk.Label(frame_direita, text="Resultado aparecerá aqui", fg="blue", font=("Arial", 12, "bold"))
label_resultado.pack(pady=10)

janela.mainloop()