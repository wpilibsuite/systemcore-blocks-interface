# This class provides functions used when executing blocks.

import json

class BlockExecution:
    current_class_name: str = ''
    current_block_id: str = ''
    current_block_type: str = ''
    current_block_label: str = ''
    current_block_execution_finished: bool = False

    @classmethod
    def startBlockExecution(cls, json_text: str) -> bool:
        o = json.loads(json_text)
        cls.current_class_name = o['className']
        cls.current_block_id = o['blockId']
        cls.current_block_type = o['blockType']
        cls.current_block_label = o['blockLabel']
        cls.current_block_execution_finished = False
        return True

    @classmethod
    def endBlockExecution(cls, value):
        cls.current_block_execution_finished = True
        return value

    @classmethod
    def handleFatalError(cls, e) -> None:
        if cls.current_block_label:
            subordinating_conjunction = (
                'after' if cls.current_block_execution_finished else 'while')
            print(f'\nFatal error occurred {subordinating_conjunction} '
                  f'executing the block labeled "{cls.current_block_label}" '
                  f'in {cls.current_class_name}.\n')
